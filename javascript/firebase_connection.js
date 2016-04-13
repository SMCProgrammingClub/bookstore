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
			"<li class='post'>" +
				book+"-------"+
				subject+"-------"+
				user+
			"</li>"
		);
	});
}, function(error){
	console.log(error);
});

