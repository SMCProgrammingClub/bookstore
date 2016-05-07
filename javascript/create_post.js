// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");
var bookstorePosts = bookstoreBase.child("posts");

//var title = $("#book_title");
//var author = $("#author");
//var isbn = $("#isbn");
//var subject = $("#subject");
//var course = $("#subject_class");
//var condition = $("#condition_type");
//var comments = $("#condition_comment");


$("#create-post-button").click(function() {
  
  var book_title = document.getElementById("book_title");
  var title = book_title.value;
  
  var author1 = document.getElementById("author");
  var author = author1.value;
  
  var isbn1 = document.getElementById("isbn");
  var isbn = isbn1.value;
  
  var subject1 = document.getElementById("subject");
  var subject = subject1.value;
  
  var subject_class = document.getElementById("subject_class");
  var course = subject_class.value;
  
  var condition_type = document.getElementById("condition_type");
  var condition = condition_type.value;
  
  var condition_comment = document.getElementById("condition_comment");
  var comments = condition_comment.value;
  
  
  newPost = { 'Title': title, 'Author': author, 'ISBN': isbn, 'Subject': subject, 'Course': course, 'Condition': condition, 'Comments': comments };
  console.log("Adding new post: ", newPost);
  var newBookstorePost =  bookstorePosts.push(newPost);
}); 
   
