var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");

var testRoute = crossroads.addRoute('/{firebaseID}', function(firebaseID){
  console.log("HELLO: " + firebaseID);

  var fbPost = bookstoreBase.child("posts/" + firebaseID);
  fbPost.once("value", function(snapshot) {
    if(!snapshot.exists()) {
      console.log("Post with ID: " + firebaseID + " does not exist!");
    } else {

      var post = snapshot.val();
      $("#book-title").html(post.Title);
      $("#book-author").html(post.Author);
      $("#book-price").html("$"+post.Price);
      $("#book-isbn").html(post.ISBN);
      $("#book-condition").html(post.Condition);
      $("#book-subject").html(post.Subject);
      $("#book-description").html(post.Comments);
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
