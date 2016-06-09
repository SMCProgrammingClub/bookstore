
var post;
var owner;

function isValidPost(post) {
  return (post && post.title && post.author && post.price && post.isbn && post.condition && post.subject && post.user);
}
function isValidUser(user) {
  return (user && user.name && user.contact);
}

function invalidPostRedirect() {
  alert("Oops! Something is wrong with this post, sorry! Sending you back to the home page...");
  window.location.href = "../index.html";
}

function isPostOwner(post, uid) {
  return post.user === uid;
}

function showOwnerView() {
  $(".owner").show();
}
function hideOwnerView() {
  $(".owner").hide();
}

var postRoute = crossroads.addRoute('/{firebaseID}', function(firebaseID){

  var fbPost = authManager.fbPostsRef.child(firebaseID);
  fbPost.once("value", function(snapshot) {

    post = snapshot.val();
    if(!isValidPost(post)) {
      console.error("[PostRouter] Post with ID: " + firebaseID + " is not valid");
      invalidPostRedirect();
    }
    else {

      var fbUser = authManager.fbUsersRef.child(post.user);
      fbUser.once("value", function(userSnap) {
        owner = userSnap.val();
        if(!isValidUser(owner)) {
          console.error("[PostRouter] User with ID: " + post.user + " is not valid");
          invalidPostRedirect();
        }
        else {
          $("#book-title").text(post.title);
          $("#book-author").text(post.author);
          $("#book-price").text("$"+post.price);
          $("#book-isbn").text(post.isbn);
          $("#book-condition").text(post.condition);
          $("#book-subject").text(post.subject);
          $("#book-description").text(post.comments);
          $("#book-image").attr("src", post.image);

          $("#user-name").text(owner.name);
          var pref = owner.contact.preferred;
          var contactValue = owner.contact[pref];
          pref = pref.charAt(0).toUpperCase() + pref.slice(1); // Capitalize eg: 'email' -> 'Email'
          $("#user-contact").text(pref + ": " + contactValue);

          $(document).on('am:enterState', function(event, state) {
            if (state === authManager.states.LOGGED_IN && isPostOwner(post, authManager.authData.uid)) {
              console.log("[PostRouter] Current user created this post");
              showOwnerView();
            }
            else {
              hideOwnerView();
            }
          });
          $(document).trigger('am:enterState', [authManager.state]);

          $("#delete-post").click(function() {
            if (authManager.state === authManager.states.LOGGED_IN && isPostOwner(post, authManager.authData.uid)) {
              if(confirm("Are you sure you want to delete this post?")) {
                console.log("[PostRouter] Deleting post");
                fbPost.remove();
                window.location.href = '../index.html';
              }
            }
            else {
              console.error("[PostRouter] You must be logged in as this post's owner to delete the post! Nice try");
            }
          });
        }
      });
    }
  });
});

window.addEventListener("hashchange", function() {
  var route = '/';
  var hash = window.location.hash;
  if (hash.length > 0) {
    route = hash.split('#').pop();
  }
  console.log("Route: " + route);
  crossroads.parse(route);
});
window.dispatchEvent(new CustomEvent("hashchange"));
