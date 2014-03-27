var superagent = require('superagent');

/* api keys */
var lastfm_key = '5daa23e1e48017196a0a2dd126107ab1';
var lastfm_secret = '77ccbb264459e7bdeb1bf1cd8c62df96';

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
  var random_artist = get_random_element(artist_array);
  lastfm_info.artist_name = random_artist.name;
  get_artist(lastfm_info, req);
}

/* emits io artist_send from artist json */
function handle_artist(error, lastfm_response, lastfm_info, req) {
  if (error) {
    console.log(error);
    return;
  }

  var star = lastfm_response.body.artist;
  var music_response = {};
  music_response.star = {};
  music_response.star.listeners = star.stats.listeners;


  var similar_artists = star.similar.artist;
  var sim_arts = new Array(5);
  for (var i=0; i < sim_arts.length; i++) {
    sim_arts[i] = simplify_lastfm_artist(similar_artists[i]);
  }
  music_response.sim_arts = sim_arts;

  req.io.emit('send_artist_info', music_response);
}

function get_random_element(array) {
  var idx = Math.floor(Math.random() * array.length);
  var random_thing = array[idx];
  return random_thing;
}

function get_large_image(img_array) {
  /*
  for (var i=img_array.length - 1; i>=0; i--) {
    if (img_array[i].size == 'large') {
      return img_array[i];
    }
  }

  return get_random_element(img_array);
  */
  return img_array[img_array.length-1];
}

function simplify_lastfm_artist(lastfm_artist) {
  var simple = {};
  simple.name = lastfm_artist.name;
  var img = get_large_image(lastfm_artist.image);
  simple.image = img['#text'];
  return simple;
}

/* wraps superagent REST call to last.fm to get artist json from artist name */
function get_artist(lastfm_info, req) {
  superagent.get("http://ws.audioscrobbler.com/2.0/")
    .query({
      method: "artist.getinfo",
      api_key: lastfm_key,
      format: "json",
      artist: lastfm_info.artist_name
    })
    .set({accept: 'application/json'})
    .end(function(error, data) {
      handle_artist(error, data, lastfm_info, req);
    });
}


exports.get_artist = get_artist;
exports.handle_artist = handle_artist;
exports.get_top_artists = get_top_artists;
exports.handle_artistlist = handle_artistlist;
