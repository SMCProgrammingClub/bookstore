// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");

var bookListings = $('#bookListings');

// loads the filtered posts into the html
function searchPosts(searchText, filter) {
  console.log("Searching " + filter + " for " + searchText);
  bookstoreBase.child('posts').orderByChild(filter).equalTo(searchText).once("child_added", function(snapshot){
    var postSnap = snapshot.val();

    // test values, test html
    // edit here to add more categories like price, date, condition, etc.
    var title = postSnap.Title;
    var author = postSnap.Author;
    var price = postSnap.Price;

    // temporary html template
    // again, edit as necessary
    // <a href="#" class="list-group-item">Dapibus ac facilisis in</a>
    var postKey = snapshot.ref().key();
    bookListings.append(
      "<a href='post/#/"+postKey+"' class='post list-group-item'>"+
        "<span class='post-title'>"+title+"</span>"+
        " - "+
        "<span class='post-author'>"+author+"</span>"+
        "<span class='post-price'>$"+price+"</span>"+
      "</a>"
    );
  }, function(error){
    console.log(error);
  });
}

// when search-button is clicked, call searchPosts with parameters (exact search)
$('#search-button').click(function() {
  bookListings.empty();
  var searchText = $('#search-field').val();
  var filter = $('#filter-button').text().trim();
  searchPosts(searchText, filter);
});