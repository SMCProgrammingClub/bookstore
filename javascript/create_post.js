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


// Submit create post form

$("#create-post-button").click(function() {
  // Create a post object with all of the REQUIRED values
  var post = {
    Title:      $("#book_title").value,
    Author:     $("#author").value,
    Isbn:       $("#isbn").value,
    Subject:    $("#subject").value,
    Course:     $("#subject_class").value,
    Condition:  $("#condition_type").value,
    Price:      $("#price").value,
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
  post.Comments = $("#condition_comment").value;
  post.Image = bookImageURL;
  console.log("Adding new post: ", post);
  var newBookstorePost =  bookstorePosts.push(post);
}); 