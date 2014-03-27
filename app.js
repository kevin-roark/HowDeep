var superagent = require('superagent');
var consolidate = require('consolidate');
var express = require('express');
var fm = require('./last.fm');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

/* build the app */
var port = process.env.PORT || 3000;
if (process.env.IP) {
  app.listen(port, process.env.IP);
} else {
  app.listen(port);
}
console.log('listening on *:' + port);

/* set up pre-compilation of handlebars templates.. REMOVE AFTER DEV */
var hbsPrecompiler = require('handlebars-precompiler');
hbsPrecompiler.watchDir(
  __dirname + "/views/templates",
  __dirname + "/public/js/templates.js",
  ['handlebars', 'hbs']
);

/* assign handlebars engine to html files */
app.engine('html', consolidate.handlebars);

/* set html as default file extension */
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

/* Set up static folder */
app.use(express.static(__dirname + '/public'));

/* set up sessions ... I'll probably use them */
app.use(express.cookieParser());
app.use(express.session({secret: 'totally_secret'}));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

/* Ready route means feed top artist! */
io.on('connection', function(socket) {
  socket.on('ready', function() {
    console.log('got ready');
  });

  socket.on('clicked_artist', function() {
    //var lastfm_info = req.data;
    //fm.get_artist(lastfm_info, req);
  });
});
