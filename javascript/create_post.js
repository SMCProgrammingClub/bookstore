// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");
var bookstorePosts = bookstoreBase.child("posts");


// Image uploading stuff

// Set cloudinary config
$.cloudinary.config({ cloud_name: 'smc-programming-club', api_key: '696479515726622' });
var bookImageURL = '';

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
      return $.cloudinary.image(data.result.public_id, { width: 256, height: 256 }).addClass('center-block');
    });
  });
$('.cloudinary_fileupload').hide();
$('.upload-button').click(function() {
  $('.cloudinary_fileupload').trigger('click');
});

// Submit create post form

$("#create-post-button").click(function() {
  // Create a post object with all of the REQUIRED values
  var post = {
    title:      $("#book_title").val(),
    author:     $("#author").val(),
    isbn:       $("#isbn").val(),
    subject:    $("#subject").val(),
    course:     $("#subject_class").val(),
    condition:  $("#condition_type").val(),
    price:      $("#price").val(),
  }
  console.log(post);
  
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
  post.comments = $("#condition_comment").val();
  post.image = bookImageURL;
  console.log("Adding new post: ", post);
  var newBookstorePost =  bookstorePosts.push(post);
  
  // Redirect back to home page
  location.href = 'index.html';
}); 