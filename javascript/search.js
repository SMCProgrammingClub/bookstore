// main connection to firebase
var bookstoreBase = authManager.fbRef;

var bookListings = $('#bookListings');
var postArray = [];
var visiblePostArray = [];
var pages = 1;
var postsPerPage = 20;
var searchableKeys = ['title', 'author', 'isbn'];

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

function fetchAllPosts(cb) {
  bookstoreBase.child('posts').once('value',
  function(snapshot) {
    var posts = snapshot.val();
    cb(posts);
  },
  function(err) {
    cb(null);
  });
}

// Turn a posts object into an array of posts
function convertPostsToSearchableArray(posts) {
  var arr = [];
  for (var postKey in posts) {
    var post = posts[postKey];
    post.key = postKey;
    // Add 'searchable' versions of post keys to make searching terms easier
    searchableKeys.forEach(function(elem, i, array) {
      post['search' + elem] = simplifyText(post[elem]);
    });
    arr.push(post);
  }
  return arr;
}

function initialize(cb) {
  fetchAllPosts(function(posts) {
    postArray = convertPostsToSearchableArray(posts);
    cb();
  });
}

function showVisiblePosts() {
  if (visiblePostArray.length > 0) {
    bookListings.empty(); // Clear booklistings so we don't show any duplicate posts
    var maxPosts = pages * postsPerPage;
    for (var i = 0; i < maxPosts && i < visiblePostArray.length; i++) {
      var p = visiblePostArray[i];
      listPost(p, p.key);
    }

    // Hide the 'load more...' button if there are no more posts to load
    if (visiblePostArray.length > maxPosts) {
      $('#load-more').show();
    }
    else {
      $('#load-more').hide();
    }

  }
}

function showAllPosts() {
  visiblePostArray = postArray;
  showVisiblePosts();
}

// Search all posts for the given term and list the results
function searchPosts(searchTerm, searchKey) {
  
  // Return with an error if attempting to search with an invalid key
  if (searchableKeys.indexOf(searchKey) < 0) {
    console.error('Invalid search key: ' + searchKey);
    return false;
  }
  
  console.log('Searching posts for ' + searchKey + ': ' + searchTerm);
  
  searchTerm = simplifyText(searchTerm);

    
  // Using the Fuse.js library to find approximate matches.
  // You can find the documentation here:
  // http://kiro.me/projects/fuse.html
  
  // Set up a Fuse object to do a 'fuzzy' (approximate) search
  var threshold = (searchKey === 'isbn') ? 0.0 : 0.4; // If searching by ISBN, don't do any fuzzy matching
  var options = { keys: ['search' + searchKey], threshold: threshold };
  var f = new Fuse(postArray, options);
  
  visiblePostArray = f.search(searchTerm); // Returns an array of matching posts
  showVisiblePosts();

  console.log('Search results:');
  console.log(visiblePostArray);
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

// Click the search button when the user hits Enter in the search field
$("#search-field").keydown(function(event){
    if(event.keyCode == 13){
      event.preventDefault();
      $("#search-button").click();
    }
});

$('#load-more').click(function(event) {
  event.preventDefault();
  pages++;
  showVisiblePosts();
});

var baseRoute = crossroads.addRoute('/', function() {
 if (postArray.length < 1) {
   initialize(function() {
     showAllPosts();
   });
 }
 else {
   showAllPosts();
 }
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
  
  if (postArray.length < 1) {
    initialize(function() {
      searchPosts(searchTerm, searchKey);
    });
  }
  else {
    searchPosts(searchTerm, searchKey);
  }

}, 5);


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