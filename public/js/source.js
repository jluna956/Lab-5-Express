// *********************************************************************
// Homework 4 APIs
// *********************************************************************

function convertMsToMinSec(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// IDs and token should come from Spotify. Avoid committing access tokens:
// they expire and should be kept out of public source code.
localStorage.setItem("artist_id", "4Z8W4fKeB5YxbusRsdQVPb");
localStorage.setItem("access_token", "BQBsgJSD0y2jYrrpXmHyb-RNoENsxcVLFmwSoikXSQmQnrC5iGzLlDXRSvlsp55ihPe8oRUimCNYq3EFtEjWQqzRMHeRWiaG3Aq3UDyXFDUe7JzmJpa9w8UQD71SirT997uy7p1tOq_D");
localStorage.setItem("track_id_1", "10nyNJ6zNy2YVYLrcwLccB");
localStorage.setItem("track_id_2", "73CKjW3vsUXRpy3NnX4H7F");
localStorage.setItem("track_id_3", "0YJ9FWWHn9EfnN0lHwbzvV");
localStorage.setItem("album_id_1", "6dVIqQ8qmQ5GBnJ9shOYGE");
localStorage.setItem("album_id_2", "5vkqYmiPBYLaalcmjujWxK");
localStorage.setItem("album_id_3", "6GjwtEZcfenmOf6l18N7T7");
localStorage.setItem("album_id_4", "35UJLpClj5EDrhpNIi4DFg");

async function load() {
  const artistID = localStorage.getItem("artist_id");
  const accessToken = localStorage.getItem("access_token");
  const trackIDs = [1, 2, 3].map((number) => localStorage.getItem(`track_id_${number}`));
  const albumIDs = [1, 2, 3, 4].map((number) => localStorage.getItem(`album_id_${number}`));

  try {
    const [artist, tracks, albums] = await Promise.all([
      makeRequest(`artists/${artistID}`, accessToken),
      Promise.all(trackIDs.map((id) => makeRequest(`tracks/${id}`, accessToken))),
      Promise.all(albumIDs.map((id) => makeRequest(`albums/${id}`, accessToken))),
    ]);

    const artistName = document.querySelector('#artist-name');
    if (artistName) artistName.textContent = artist.name;

    document.querySelectorAll('.track').forEach((element, index) => {
      const track = tracks[index];
      if (!track || track.error) return;
      const title = element.querySelector('.track-title');
      const album = element.querySelector('.track-album');
      const duration = element.querySelector('.track-duration');
      const image = element.querySelector('img');
      if (title) title.textContent = track.name;
      if (album) album.textContent = track.album.name;
      if (duration) duration.textContent = convertMsToMinSec(track.duration_ms);
      if (image && track.album.images?.[0]) image.src = track.album.images[0].url;
    });

    document.querySelectorAll('.album-card').forEach((element, index) => {
      const album = albums[index];
      if (!album || album.error) return;
      const title = element.querySelector('h3');
      const details = element.querySelector('p');
      const image = element.querySelector('img');
      if (title) title.textContent = album.name;
      if (details) details.textContent = `${album.release_date?.slice(0, 4) ?? ''} • ${album.album_type}`;
      if (image && album.images?.[0]) image.src = album.images[0].url;
    });
  } catch (error) {
    console.error("Error fetching data from Spotify API:", error);
  }
}

async function makeRequest(endpoint, accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Spotify request failed (${response.status}): ${endpoint}`);
  }
  return response.json();
}

load();
