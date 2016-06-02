var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");

var testRoute = crossroads.addRoute('/{firebaseID}', function(firebaseID){
  console.log("HELLO: " + firebaseID);

  var fbPost = bookstoreBase.child("posts/" + firebaseID);
  fbPost.once("value", function(snapshot) {
    if(!snapshot.exists()) {
      console.log("Post with ID: " + firebaseID + " does not exist!");
    } else {

      var post = snapshot.val();
      $("#book-title").html(post.title);
      $("#book-author").html(post.author);
      $("#book-price").html("$"+post.price);
      $("#book-isbn").html(post.isbn);
      $("#book-condition").html(post.condition);
      $("#book-subject").html(post.subject);
      $("#book-description").html(post.comments);
      $("#book-image").attr("src", post.image);
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
