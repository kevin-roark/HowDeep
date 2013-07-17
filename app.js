var expressio = require('express.io');
var superagent = require('superagent');
var consolidate = require('consolidate');

var app = expressio();

/* set up pre-compilation of handlebars templates.. REMOVE AFTER DEV */
var hbsPrecompiler = require('handlebars-precompiler');
hbsPrecompiler.watchDir(
  __dirname + "/views",
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

app.http().io();

var lastfm_key = '5daa23e1e48017196a0a2dd126107ab1';
var lastfm_secret = '77ccbb264459e7bdeb1bf1cd8c62df96';

/* Setup the ready route, and emit talk event. */
app.io.route('ready', function(req) {
  
    var lastfm_info = {};
    get_top_artists('5');
    
    function handle_artistlist(error, lastfm_response) {
      if (error) {
        console.log(error);
        return;
      }
      var artist_array = lastfm_response.body.artists.artist;
      var idx = Math.floor(Math.random() * artist_array.length);
      var random_artist = artist_array[idx];
      lastfm_info['artist_name'] = random_artist.name;
      get_similar(random_artist)
    }
    
    function handle_similar(error, lastfm_response) {
      if (error) {
        console.log(error);
        return;
      }
      var similar_artists = lastfm_response.body.artist.similar.artist;
      lastfm_info['similar_artists'] = similar_artists;
      
      req.io.emit('talk', lastfm_info);
    }
    
    function get_similar(artist) {
      superagent.get("http://ws.audioscrobbler.com/2.0/")
        .query({
          method: "artist.getinfo",
          api_key: lastfm_key,
          format: "json",
          mbid: artist.mbid,
          artist: artist.name
        })
        .set({accept: 'application/json'})
        .end(handle_similar)
    }
    
    function get_top_artists(limit) {
      superagent.get("http://ws.audioscrobbler.com/2.0/")
        .query({
          method: "chart.gettopartists",
          api_key: lastfm_key,
          format: "json",
          limit: limit
        })
        .set({accept: 'application/json'})
        .end(handle_artistlist);
    }
})


app.get('/', function(req, res) {
    
    res.sendfile(__dirname + '/views/index.html');
    return;
    
})

// build realtime-web app
app.listen(process.env.PORT, process.env.IP)