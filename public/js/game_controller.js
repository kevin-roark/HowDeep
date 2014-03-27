var gameIO = require('./game_io');

$('.artist').on('click', function() {
  name = $(this)[0].innerHTML;
  similar_clicked(name);
});

$('.artist').click(function() {
  var name = $(this).html();
  gameIO.socket.emit('clicked_artist', {artist_name: name});
});
