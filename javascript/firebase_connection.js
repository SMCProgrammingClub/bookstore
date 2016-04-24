// main connection to firebase
var bookstoreBase = new Firebase("https://blinding-torch-3304.firebaseio.com/");

var bookListings = $('#bookListings');

// loads the posts into the html
bookstoreBase.child('posts').once("value", function(snapshot){
	snapshot.forEach(function(postSnapshot){
		var postSnap = postSnapshot.val();
		
		// test values, test html
		// edit here to add more cetegories like price, date, condition, etc.
		var book = postSnap.book;
		var subject = postSnap.subject;
		var category = postSnap.category;
		var user = postSnap.user;
		
		// temporary html template
		// again, edit as necessary
		bookListings.append(
			"<div class='post'>" +
				"<p class='post_book'>"+book+"</p>"+
				"<p class='post_subject'>"+subject+"</p>"+
				"<p class='post_user'>"+user+"</p>"+
			"</div>"
		);
	});
}, function(error){
	console.log(error);
});

