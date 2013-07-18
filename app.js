var expressio = require('express.io');
var superagent = require('superagent');
var consolidate = require('consolidate');

var app = expressio();

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
app.use(expressio.static(__dirname + '/public'));

/* set up realtime io engine thing */
app.http().io();

/* api keys */
var lastfm_key = '';
var lastfm_secret = '';

/* set up route for home page */
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

/* Ready route means feed top artist! */
app.io.route('ready', function(req) {
  get_top_artists('5', req);
});

/* Clicked a similar artist means reset artist view with new similars! */
app.io.route('clicked_artist', function(req) {
  var lastfm_info = req.data;
  get_artist(lastfm_info, req);
});

/* wraps superagent REST call to last.fm to get top *limit* artists */
function get_top_artists(limit, req) {
  superagent.get("http://ws.audioscrobbler.com/2.0/")
    .query({
      method: "chart.gettopartists",
      api_key: lastfm_key,
      format: "json",
      limit: limit
    })
    .set({accept: 'application/json'})
    .end(function(error, object) {
      handle_artistlist(error, object, {}, req);
    });
}

/* grabs artist name and then sends it to get_artist */
function handle_artistlist(error, lastfm_response, lastfm_info, req) {
  if (error) {
    console.log(error);
    return;
  }
  var artist_array = lastfm_response.body.artists.artist;
  var idx = Math.floor(Math.random() * artist_array.length);
  var random_artist = artist_array[idx];
  lastfm_info['artist_name'] = random_artist.name;
  get_artist(lastfm_info, req);
}

/* emits io artist_send from artist json */
function handle_similar(error, lastfm_response, lastfm_info, req) {
  if (error) {
    console.log(error);
    return;
  }
  var similar_artists = lastfm_response.body.artist.similar.artist;
  lastfm_info['similar_artists'] = similar_artists;
  //console.log(similar_artists);

  req.io.emit('send_artist_info', lastfm_info);
}

/* wraps superagent REST call to last.fm to get artist json from artist name */
function get_artist(lastfm_info, req) {
  superagent.get("http://ws.audioscrobbler.com/2.0/")
    .query({
      method: "artist.getinfo",
      api_key: lastfm_key,
      format: "json",
      artist: lastfm_info['artist_name']
    })
    .set({accept: 'application/json'})
    .end(function(error, data) {
      handle_similar(error, data, lastfm_info, req);
    });
}

/* build the app */
app.listen(process.env.PORT, process.env.IP)