// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");
var bookstorePosts = bookstoreBase.child("posts");

var book_title = document.getElementById("book_title");
var author1 = document.getElementById("author");
var isbn1 = document.getElementById("isbn");
var subject1 = document.getElementById("subject");
var subject_class = document.getElementById("subject_class");
var condition_type = document.getElementById("condition_type");
var price1 = document.getElementById("price");
var condition_comment = document.getElementById("condition_comment");

$("#create-post-button").click(function() {
  
  var title = book_title.value;
  var author = author1.value;
  var isbn = isbn1.value;
  var subject = subject1.value;
  var course = subject_class.value;
  var condition = condition_type.value;
  var price = price1.value;
  var comments = condition_comment.value;
  
  newPost = { 'Title': title, 'Author': author, 'ISBN': isbn, 'Subject': subject, 'Course': course, 'Condition': condition, 'Price': price, 'Comments': comments };
  console.log("Adding new post: ", newPost);
  var newBookstorePost =  bookstorePosts.push(newPost);
}); 
   
