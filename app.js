var expressio = require('express.io');
var superagent = require('superagent');
var consolidate = require('consolidate');
var fm = require('tools.last.fm');

var app = expressio();

/* set up pre-compilation of handlebars templates.. REMOVE AFTER DEV */
var hbsPrecompiler = require('handlebars-precompiler');
hbsPrecompiler.watchDir(
  __dirname + "/views/templates",
  __dirname + "/public/js/templates.js",
  ['handlebars', 'hbs']
);

/* set up realtime io engine thing */
app.http().io();

/* assign handlebars engine to html files */
app.engine('html', consolidate.handlebars);

/* set html as default file extension */
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

/* Set up static folder */
app.use(expressio.static(__dirname + '/public'));

/* set up sessions ... I'll probably use them */
app.use(expressio.cookieParser());
app.use(expressio.session({secret: 'totally_secret'}));


/* set up route for home page */
/*app.get('/', function(req, res) {
    res.sendfile(__dirname + '/views/index.html');
});*/

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/views/how_deep.html');
});

/* Ready route means feed top artist! */
app.io.route('ready', function(req) {
  fm.get_top_artists('5', req);
});

/* Clicked a similar artist means reset artist view with new similars! */
app.io.route('clicked_artist', function(req) {
  var lastfm_info = req.data;
  fm.get_artist(lastfm_info, req);
});

/* build the app */
app.listen(process.env.PORT, process.env.IP);