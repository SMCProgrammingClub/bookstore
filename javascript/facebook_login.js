var ref = new Firebase("https://blinding-torch-3304.firebaseio.com");
var usersRef = ref.child('users');

 $("#logout").hide();

//login
$("#login").click(function(){
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });
});

//nav options for logged in
ref.onAuth(function(authData) {
  if(authData) {
    $("#login").hide();
    $("#username").show();
    $("#logout").show();  
    $("#username").html(authData.facebook.displayName);
    
    usersRef.child(authData.uid).update({
      name: authData.facebook.displayName
    });
  }
}); 

//logout
$("#logout").click(function() {
  ref.unauth(); 
  $("#login").show();
  $("#username").hide();
  $("#logout").hide();  
}); 
