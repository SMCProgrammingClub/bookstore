// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");
var bookstorePosts = bookstoreBase.child("posts");

var title = $("#book_title");
var author = $("#author");
var isbn = $("#isbn");

$("#create-post-button").click(function() {
  newPost = { 'Title': title.text(), 'Author': author.text(), 'ISBN': isbn.text() };
  console.log("Adding new post: ", newPost);
  var newBookstorePost =  bookstorePosts.push(newPost);
}); 
   
