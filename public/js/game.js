var io = io.connect()

// Emit ready event.
io.emit('ready')

// Listen for the talk event.
io.on('talk', function(data) {
    var artist_html = Handlebars.templates['artists'](data);
    $('#test').html(artist_html);
})