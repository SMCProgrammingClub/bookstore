function AuthManager(config) {
  if (!(this instanceof AuthManager)) {
    return new AuthManager();
  }

  this.fbBaseRef = new Firebase("https://blinding-torch-3304.firebaseio.com/" + config.firebaseRoot);
  this.fbConfigRef = this.fbBaseRef.child('config');
  this.fbPostsRef = this.fbBaseRef.child('posts');
  this.fbUsersRef = this.fbBaseRef.child('users');

  this.authData;
  this.fbUser;
  
  this.debug = true;
  
  this.log = function(msg) {
    if (this.debug)
      console.log('[AuthManager] ' + msg);
  };
  this.error = function(msg) {
    if (this.debug)
      console.error('[AuthManager] Error: ' + msg);
  };

  this.log(config);

  this.states = {
    LOGGED_OUT: 'LOGGED_OUT',
    AUTHORIZING: 'AUTHORIZING',
    VALIDATING: 'VALIDATING',
    SIGNING_UP: 'SIGNING_UP',
    LOGGED_IN: 'LOGGED_IN',
  };

  this.isValidState = function (state) {
    for (var s in this.states) {
      if (state === s) {
        return true;
      }
    }
    return false;
  };

  this.nextStates = {
    LOGGED_OUT: {
      AUTHORIZING: 'AUTHORIZING',
      VALIDATING: 'VALIDATING',
      LOGGED_OUT: 'LOGGED_OUT'
    },
    AUTHORIZING: {
      VALIDATING: 'VALIDATING',
      LOGGED_OUT: 'LOGGED_OUT'
    },
    VALIDATING: {
      SIGNING_UP: 'SIGNING_UP',
      LOGGED_IN: 'LOGGED_IN',
      LOGGED_OUT: 'LOGGED_OUT'
    },
    SIGNING_UP: {
      LOGGED_IN: 'LOGGED_IN',
      LOGGED_OUT: 'LOGGED_OUT'
    },
    LOGGED_IN: {
      LOGGED_OUT: 'LOGGED_OUT'
    }
  };

  // Set the initial state
  this.state = this.states.LOGGED_OUT;

  this.isValidTransitionState = function (nextState) {
    var validStates = this.nextStates[this.state];
    for (var s in validStates) {
      if (nextState === s) {
        return true;
      }
    }
    return false;
  };

  this.transition = function (nextState) {
    if (!this.isValidState(nextState) || !this.isValidTransitionState(nextState)) {
      this.error('Attempted to transition to invalid state: ' + this.state + ' -> ' + nextState);
      return false;
    }

    $(document).trigger('am:exitState', [this.state]);
    $(document).trigger('am:stateChange', [this.state, nextState]);
    this.state = nextState;
    $(document).trigger('am:enterState', [this.state]);

  };


  this.fetchUser = function (cb) {
    var uid = this.authData.uid;
    this.fbUsersRef.child(uid).once('value',
      function (snapshot) {
        this.fbUser = snapshot.val();
        cb();
      }.bind(this),
      function (error) {
        console.error(error);
        cb();
      }.bind(this));
  };
  
  // Do any user validation here
  this.isUserValid = function (user) {
    return (user && user.name && user.contact);
  };
  
  this.facebookAuth = function () {
    this.fbBaseRef.authWithOAuthPopup('facebook', function(err, authData) {
      if (err) {
        this.error('Facebook auth failed!');
      }
      else {
        this.log('Facebook auth succeeded!');
      }
    }.bind(this));
  }
  
  this.updateUser = function(newUser, cb) {
    var uid = this.authData.uid;
    this.log('Updating user');
    this.fbUsersRef.child(uid).update(newUser, function(err) {
      if(!err) {
        this.log('User update succeeded');
      }
      else {
        this.error('User update failed');
      }
      cb(err);
    }.bind(this));
  }

  this.fbBaseRef.onAuth(function (authData) {
    this.log('Firebase onAuth');
    if (authData) {
      this.authData = authData;
      this.log('Firebase authData received');

      this.transition(this.states.VALIDATING);

      this.fetchUser(function () {
        if (this.fbUser && this.isUserValid(this.fbUser)) {
          this.log('User is valid, logging in...');
          this.transition(this.states.LOGGED_IN);
        }
        else {
          this.log('User is invalid, signing up...');
          this.transition(this.states.SIGNING_UP);
        }
      }.bind(this));
    }
    else {
      this.log('No Firebase authData');
      this.transition(this.states.LOGGED_OUT);
    }
  }.bind(this));
}

$(document).on('am:stateChange', function (e, currentState, nextState) {
    console.log('%c[AuthManager] State change: ' + currentState + ' -> ' + nextState, 'color: blue');
});

var config = {
  firebaseRoot: 'test',
}
  var authManager = new AuthManager(config);



