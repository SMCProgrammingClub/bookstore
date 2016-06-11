if(!authManager) {
  console.error('ERROR: Make sure authManager.js is included before this script!');
}

// Get everything in a good initial state
$(".logged-in").hide();
$("#signup-modal").modal({
  show: false,
  keyboard: false
});

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
    var escapedUID = encodeURIComponent(authManager.authData.uid);
    $("#user-profile-link").attr('href', 'profile/#/' + escapedUID);
    
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
  if (authManager.authData && authManager.authData.facebook) {
    if (authManager.authData.facebook.displayName) {
      $("#signup-name").attr("placeholder", authManager.authData.facebook.displayName);
      $("#signup-name").val(authManager.authData.facebook.displayName);
      $("#signup-name").attr("readonly", true);
    }
    if (authManager.authData.facebook.profileImageURL) {
      $("#profile-image").attr("src", authManager.authData.facebook.profileImageURL);
    }
  }
}

$("#signup-modal-submit").click(function() {
  var contactValue = $("#contact-field").val();
  var contactKey = $("#contact-type").text().trim().toLowerCase();
  var newUser = {
    name: $("#signup-name").val(),
    image: '',
    contact: {
      preferred: ''
    }
  }
  if ($("#use-image").is(":checked")) {
    newUser.image = $("#profile-image").attr("src");
  }
  newUser.contact.preferred = contactKey;
  newUser.contact[contactKey] = contactValue;

  console.log(newUser);
  
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
