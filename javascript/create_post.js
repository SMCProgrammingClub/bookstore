// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");
var bookstorePosts = bookstoreBase.child("posts");

/*              So JS is just being weird and does not throw the same errors when I did this before,
 *              but it feels like working now that we've put it into an array, so it's all good
 *              
var form = {
   book_title:         document.getElementById("book_title"),
   author1:            document.getElementById("author"),
   isbn1:              document.getElementById("isbn"),
   subject1:           document.getElementById("subject"),
   subject_class:      document.getElementById("subject_class"),
   condition_type:     document.getElementById("condition_type"),
   price1:             document.getElementById("price"),
   condition_comment:  document.getElementById("condition_comment")
}*/

$("#create-post-button").click(function() {
  
  // Create a post object with all of the REQUIRED values
  var post = {
    Title:      document.getElementById("book_title").value,
    Author:     document.getElementById("author").value,
    Isbn:       document.getElementById("isbn").value,
    Subject:    document.getElementById("subject").value,
    Course:     document.getElementById("subject_class").value,
    Condition:  document.getElementById("condition_type").value,
    Price:      document.getElementById("price").value,
   // Comments:   document.getElementById("condition_comment").value,
  }
  
  // Loop over everything in the post object (only the REQUIRED stuff)
  for (var key in post) {
    if (post.hasOwnProperty(key)) {
      
      // If the value of p[key] is null or empty, alert and return out of this function
      if (!post[key]) {
        alert("You must enter a value for " + key + "!");
        return;
      }
    }
  }
  
  // Now that we have already checked that all the REQUIRED stuff is there,
  // add the stuff that isn't required here.
  post.Comments = condition_comment.value;
  console.log("Adding new post: ", post);
  var newBookstorePost =  bookstorePosts.push(post);
}); 







// main connection to firebase
/*
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
  
  if (!title || !author || !isbn || !subject || !course || !condition || !price || !comments) {
    alert("Title of the book must be filled out!");
    return;
  }

  newPost = { 'Title': title, 'Author': author, 'ISBN': isbn, 'Subject': subject, 'Course': course, 'Condition': condition, 'Price': price, 'Comments': comments };
  console.log("Adding new post: ", newPost);
  var newBookstorePost =  bookstorePosts.push(newPost);
}); 

*/
