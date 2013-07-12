/* Create a cache object */
var cache = new LastFMCache();

/* Create a LastFM object */
var lastfm = new LastFM({
	apiKey    : api_key,
	apiSecret : secret_key,
	cache     : cache
});

/* Load some artist info. */
/*lastfm.artist.getInfo(
  {artist: 'converge', username: 'latebl00mer'}, 
  {success: handleArtist, error: handleError}
);*/

function retrieveHyped() {
  lastfm.chart.getHypedArtists(
    {limit: '25'},
    {},
    {success: getRandomChartArtist, error: handleError}
  );
}

function getRandomChartArtist(data) {
  artist_array = data.artists.artist;
  num = Math.floor(Math.random() * 25);
  randomArtist = artist_array[num];
  window.document.getElementById('artist').innerHTML = randomArtist.name;
  handleArtist(randomArtist);
}

function handleArtist(artistOb) {
  lastfm.artist.getInfo(
    {mbid: artistOb.mbid, artist: artistOb.name},
    {success: handleSimilarArtists, error: handleError}
  );
}

function handleSimilarArtists(info) {
  similar_artists = info.artist.similar.artist;
  artist_description = '';
  for (i=0; i<similar_artists.length; i++) {
    artist_description += similar_artists[i].name + '<br>'
  }
  window.document.getElementById('similar').innerHTML = artist_description;
}

function handleError(errorCode, errorMsg) {
  console.log(errorMsg);
}

retrieveHyped();