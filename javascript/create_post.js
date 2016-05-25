// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");
var bookstorePosts = bookstoreBase.child("posts");


// Image uploading stuff

// Set cloudinary config
$.cloudinary.config({ cloud_name: 'smc-programming-club', api_key: '696479515726622' });
var bookImageURL;

// Set the upload button to upload to cloudinary
$('.cloudinary_fileupload').unsigned_cloudinary_upload("izaxgc4k", 
  { cloud_name: 'smc-programming-club' },
  { multiple: false, return_delete_token: true })
  
  // This runs every time an image gets uploaded to cloudinary
  .bind('cloudinarydone', function(e, data) {
    console.log("Picture uploaded!");
    
    // Get the image url so we can save it to Firebase
    var imgID = data.result.public_id;
    bookImageURL = "http://res.cloudinary.com/smc-programming-club/image/upload/" + imgID;
    
    // Replace the placeholder with the uploaded image
    $('#book-picture').replaceWith(function() {
      return $.cloudinary.image(data.result.public_id, { width: 256, height: 256 });
    });
  });


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
    Image:      bookImageURL,
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