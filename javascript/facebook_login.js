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
    authManager.fbRef.unauth();
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
    fillSignupForm(authManager.fbUser);
    
    $(".logged-out").hide();
    $(".logged-in").hide();
    $(".authorizing").hide();
  }
});

$(document).trigger('am:enterState', [authManager.state]);

// $(document).on('exitAuthState', function(event, state) {
//   if (state === authManager.states.LOGGED_OUT) {
//     $(".logged-out").hide();
//   }
//   else if (state === authManager.states.LOGGED_IN) {
//     $(".logged-in").hide();
//   }
//   else if (state === authManager.states.AUTHORIZING) {
//     $(".authorizing").hide();
//   }
//   else if (state === authManager.states.VALIDATING) {
    
//   }
//   else if (state === authManager.states.SIGNING_UP) {
    
//   }
// });



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

function fillSignupForm(user) {
  if (user.name) {
    $("#signup-name").attr("placeholder", user.name);
    $("#signup-name").val(user.name);
    $("#signup-name").attr("readonly", true);
  }
  if (user.contact) {
    if (user.contact.email) {
      $("#signup-email").attr("placeholder", user.contact.email);
      $("#signup-email").val(user.contact.email);
      $("#signup-email").attr("readonly", true);
    }
    if (user.contact.phone) {
      $("#signup-phone").attr("placeholder", user.contact.phone);
      $("#signup-phone").val(user.contact.phone);
      $("#signup-phone").attr("readonly", true);
    }
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
