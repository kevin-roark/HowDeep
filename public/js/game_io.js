var io = io.connect();

// Emit ready event.
io.emit('ready');

// Listen for the talk event.
io.on('send_artist_info', function(data) {
    var artist_html = Handlebars.templates['artists'](data);
    $('#game').html(artist_html);
});

function similar_clicked(name) {
  io.emit('clicked_artist', {artist_name: name});
}