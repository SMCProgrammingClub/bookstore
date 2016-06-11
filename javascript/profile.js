var user;

function isValidUser(user) {
  return (user && user.name && user.contact);
}

function invalidUserRedirect() {
  alert("Oops! Something is wrong with this user profile, sorry! Sending you back to the home page...");
  window.location.href = "../index.html";
}

function addContactInfo(key, val) {
  var Key = key.charAt(0).toUpperCase() + key.slice(1);

  $('#contact-table').append(
    "<tr id='contact-"+ key +"'>" +
      "<th scope='row'>" + Key +"</th>" +
      "<td>" + val +"</td>" +
    "</tr>");
}

var profileRoute = crossroads.addRoute('/{escapedUID}', function (escapedUID) {
  var uid = decodeURIComponent(escapedUID);
  var fbUser = authManager.fbUsersRef.child(uid);
  fbUser.once('value', function (snapshot) {

    user = snapshot.val();
    if (!isValidUser(user)) {
      console.error('[Profile] User with ID: ' + uid + ' is not valid');
      invalidUserRedirect();
    }
    else {

      if (user.image) {
        $('#user-image').attr('src', user.image);
      }
      else {
        $('#user-image').attr('src', "https://placehold.it/200x200");
      }
      $('#user-name').text(user.name);

      $('#contact-table').empty();

      for (c in user.contact) {
        if (c !== 'preferred') {
          addContactInfo(c, user.contact[c]);
        }
      }
      var pref = user.contact.preferred;
      $('#contact-' + pref).addClass('table-info');

    }
  });
});

var defaultProfileRoute = crossroads.addRoute('/', function() {
  console.log('Redirecting...');
  invalidUserRedirect();
});

window.addEventListener("hashchange", function () {
  var route = '/';
  var hash = window.location.hash;
  if (hash.length > 0) {
    route = hash.split('#').pop();
  }
  console.log("Route: " + route);
  crossroads.parse(route);
});
window.dispatchEvent(new CustomEvent("hashchange"));
