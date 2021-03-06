
var bookListings = $('#bookListings');

// loads the posts into the html
authManager.fbPostsRef.once("value", function(snapshot){
	snapshot.forEach(function(postSnapshot){
		var postSnap = postSnapshot.val();

		// test values, test html
		// edit here to add more categories like price, date, condition, etc.
		var title = postSnap.title;
		var author = postSnap.author;
		var price = postSnap.price;

		// temporary html template
		// again, edit as necessary
		// <a href="#" class="list-group-item">Dapibus ac facilisis in</a>
		var postKey = postSnapshot.ref().key();
		bookListings.append(
			"<a href='post/#/"+postKey+"' class='post list-group-item'>"+
				"<span class='post-title'>"+title+"</span>"+
				" - "+
				"<span class='post-author'>"+author+"</span>"+
				"<span class='post-price'>$"+price+"</span>"+
			"</a>"
		);
		// bookListings.append(
		// 	"<div class='post'>" +
		// 		"<p class='post_book'>"+title+"</p>"+
		// 		"<p class='post_subject'>"+price+"</p>"+
		// 		"<p class='post_user'>"+author+"</p>"+
		// 	"</div>"
      //change to author, title, price
		// );
	});
}, function(error){
	console.log(error);
});
