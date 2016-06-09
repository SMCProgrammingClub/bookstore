if(!authManager) {
  console.error('ERROR: Make sure authManager.js is included before this script!');
}

// Get everything in a good initial state
$(".logged-in").hide();

$(document).on('am:enterState', function(event, state) {
  if (state === authManager.states.LOGGED_OUT) {
    $(".logged-out").show();
    $("#username").text('');
    
    $(".logged-in").hide();
    $(".authorizing").hide();
    $(".signing-up").hide();
    $("#signup-modal").modal('hide');
    authManager.fbBaseRef.unauth();
  }
  else if (state === authManager.states.LOGGED_IN) {
    $(".logged-in").show();
    $("#username").text(authManager.fbUser.name);
    
    $(".logged-out").hide();
    $(".authorizing").hide();
    $(".signing-up").hide();
    $("#signup-modal").modal('hide');
  }
  else if (state === authManager.states.AUTHORIZING) {
    $("#signup-modal").modal('show');
    $(".authorizing").show();
    
    $(".logged-out").hide();
    $(".logged-in").hide();
    $(".signing-up").hide();
  }
  else if (state === authManager.states.VALIDATING) {
    // $("#signup-modal").modal('show');
    
    $(".logged-out").hide();
    $(".logged-in").hide();
    $(".signing-up").hide();
    $(".authorizing").hide();
  }
  else if (state === authManager.states.SIGNING_UP) {
    $("#signup-modal").modal('show');
    $(".signing-up").show();
    fillSignupForm();
    
    $(".logged-out").hide();
    $(".logged-in").hide();
    $(".authorizing").hide();
  }
});

$(document).trigger('am:enterState', [authManager.state]);



 $("#signup, #login").click(function() {
   authManager.transition(authManager.states.AUTHORIZING);
 });
 
 $("#facebook-signup").click(function() {
   authManager.facebookAuth();
 });
 
 // Log the user out if they don't complete the sign up
 $(".signup-modal-close").click(function() {
   authManager.transition(authManager.states.LOGGED_OUT);
 });

function fillSignupForm() {
  if (authManager.authData && authManager.authData.facebook && authManager.authData.facebook.displayName) {
    $("#signup-name").attr("placeholder", authManager.authData.facebook.displayName);
    $("#signup-name").val(authManager.authData.facebook.displayName);
    $("#signup-name").attr("readonly", true);
  }
}

$("#signup-modal-submit").click(function() {
  var newUser = {
    name: $("#signup-name").val(),
    contact: {
      email: $("#signup-email").val(),
      phone: $("#signup-phone").val(),
    }
  }
  
  if (authManager.isUserValid(newUser)) {
    authManager.updateUser(newUser, function(err) {
      if (!err) {
        authManager.fetchUser(function() {
          authManager.transition(authManager.states.LOGGED_IN);
        });
      }
      else {
        
      }
    });
  }
});

//logout
$("#logout").click(function() {
  authManager.transition(authManager.states.LOGGED_OUT);
});
