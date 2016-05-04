// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");
var bookstorePosts = bookstoreBase.child("posts");

var submit = $("#submit");

submit.click(function(){
	var title = $("#book_title").val();
	alert(title);
})
