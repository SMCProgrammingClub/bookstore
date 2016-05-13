console.log("LOADED");
var testRoute = crossroads.addRoute('/{title}', function(title){
  title = title || "NO TITLE";
  console.log("HELLO: " + title);
});

window.addEventListener("hashchange", function() {
  var route = '/';
  var hash = window.location.hash;
  if (hash.length > 0) {
    route = hash.split('#').pop();
  }
  console.log("Route: " + route);
  crossroads.parse(route);
});
window.dispatchEvent(new CustomEvent("hashchange"));
