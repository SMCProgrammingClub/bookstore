var bookstoreBase = authManager.fbRef;

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

var postRoute = crossroads.addRoute('/{firebaseID}', function(firebaseID){

  var fbPost = bookstoreBase.child("posts/" + firebaseID);
  fbPost.once("value", function(snapshot) {

    var post = snapshot.val();
    if(!isValidPost(post)) {
      console.error("[PostRouter] Post with ID: " + firebaseID + " is not valid");
      invalidPostRedirect();
    }
    else {

      var fbUser = bookstoreBase.child("users/" + post.user);
      fbUser.once("value", function(userSnap) {
        var user = userSnap.val();
        if(!isValidUser(user)) {
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

          $("#user-name").text(user.name);
          $("#user-contact").text("Contact: " + user.contact);
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
