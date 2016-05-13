$(".dropdown-menu-select li").click(function(){
  var selText = $(this).text();
  $(this).parents('.input-group-btn').find('button[data-toggle="dropdown"]').html(selText+' <span class="caret"></span>');
});
