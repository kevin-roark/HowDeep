var expressio = require('express.io');
var superagent = require('superagent');
var consolidate = require('consolidate');

var app = expressio();

/* assign handlebars engine to html files */
app.engine('html', consolidate.handlebars);

/* set html as default file extension */
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

/* Set up static folder */
app.use(expressio.static(__dirname + '/public'));

app.http().io();

var lastfm_key = '';
var lastfm_secret = '';

app.get('/', function(req, res) {
    
    var lastfm_info = {};
    
    function handle_gethyped(error, lastfm_response) {
      if (error) {
        res.render('index');
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
        res.render('index', lastfm_info);
        return;
      }
      var similar_artists = lastfm_response.body.artist.similar.artist;
      lastfm_info['similar_artists'] = similar_artists;
      res.render('index', lastfm_info);
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
          limit: "7"
        })
        .set({accept: 'application/json'})
        .end(handle_gethyped);
    }
    
    get_top_artists('10');
    
})

// build realtime-web app
app.listen(process.env.PORT, process.env.IP)