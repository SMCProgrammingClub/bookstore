// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");

var bookListings = $('#bookListings');

// Puts a post object into the bookListings
function listPost(post, key) {
  if (!key || !post.title || !post.author || !post.price) {
    console.error('ERROR: Can not list invalid post object:');
    console.log(key, post);
    return false;
  }
  bookListings.append(
    "<a href='post/#/"+key+"' class='post list-group-item'>"+
      "<span class='post-title'>"+post.title+"</span>"+
      " - "+
      "<span class='post-author'>"+post.author+"</span>"+
      "<span class='post-price'>$"+post.price+"</span>"+
    "</a>"
  );
}

// Make text lowercase and get rid of everything except numbers
// and letters to make comparing text very simple
function simplifyText(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Search all posts for the given term and list the results
function searchPosts(searchTerm, searchKey) {
  
  // Return with an error if attempting to search with an invalid key
  var searchableKeys = ['title', 'author', 'isbn'];
  if (searchableKeys.indexOf(searchKey) < 0) {
    console.error('Invalid search key: ' + searchKey);
    return false;
  }
  
  console.log('Searching posts for ' + searchKey + ': ' + searchTerm);
  
  bookListings.empty(); // Clear out the booklistings so only the matching posts appear
  searchTerm = simplifyText(searchTerm);
  
  // Get all posts from Firebase
  bookstoreBase.child('posts').once("value",
  function(snapshot) {
    var posts = snapshot.val();
    
    // Convert posts object into an array of posts
    var postArray = [];
    for (var postKey in posts) {
      var post = posts[postKey];
      if (post[searchKey]) { // We don't care about a post if it doesn't have the key we are searching for
        post.key = postKey; // Add the firebase key as a property of the object to save it
        post['search' + searchKey] = simplifyText(post[searchKey]); // Add a new property (eg: 'searchTitle') to save a simplified version of the title
        postArray.push(post);
      }
    }
    
    // Using the Fuse.js library to find approximate matches.
    // You can find the documentation here:
    // http://kiro.me/projects/fuse.html
    
    // Set up a Fuse object to do a 'fuzzy' (approximate) search
    var threshold = (searchKey === 'isbn') ? 0.0 : 0.4; // If searching by ISBN, don't do any fuzzy matching
    var options = { keys: ['search' + searchKey], threshold: threshold };
    var f = new Fuse(postArray, options);
    
    var results = f.search(searchTerm); // Returns an array of matching posts
    results.forEach(function(match) {
      listPost(match, match.key);
    });
    console.log('Search results:');
    console.log(results);
  },
  function(error) {
    console.error(error);
  });
}

// When search-button is clicked, redirect browser to appropriate search URL
// eg: http://booklr.com/#/?author=J.%20R.%20R.%20Tolkein
// The crossroads router will handle things from there
$('#search-button').click(function(event) {
  event.preventDefault(); // Stop the button from linking anywhere by itself
  
  var searchText = $('#search-field').val();
  var searchKey = $('#filter-button').text().trim().toLowerCase();
  // Convert special characters into escaped characters for URL (eg: "Hello world" -> "Hello%20world")
  var escapedSearchText = encodeURIComponent(searchText);
  
  // Construct the search URL
  var searchURL = searchKey + '=' + escapedSearchText;
  var newHash = '/search/?' + searchURL;
  
  // Redirect to the search URL
  window.location.hash = newHash;
});

// This route function will run every time the browser goes to a matching search URL
var searchRoute = crossroads.addRoute('/search/{?searchQuery}', function(searchQuery) {
  // The searchQuery object will take search URL like:
  // http://example.com/#/search/?title=someTitle&author=Bob
  // and turn it into a Javascript object like:
  // searchQuery: { title: 'someTitle', author: 'Bob' }
  
  // Currently only support searching for one property at a time, so just get the first search term
  var searchKey = Object.keys(searchQuery)[0];
  var searchTerm = decodeURI(searchQuery[searchKey]); // eg: "Hello%20world" -> "Hello world"
  
  searchPosts(searchTerm, searchKey);
});


// This junk makes the router work, not important
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