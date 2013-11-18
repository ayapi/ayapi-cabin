$(document).ready(function(){
  $.get('/side.html', function(data){
    $('.wrapper').append(data);
  });
});