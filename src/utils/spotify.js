

function getSpotifyAccessToken() {
  return new Promise((resolve, reject) => {
    const url = 'https://accounts.spotify.com/api/token';
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const data = "grant_type=client_credentials";
    const base64data = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    headers["Authorization"] = `Basic ${base64data}`;
    
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: data
    })
    .then(response => response.json())
    .then(data => {
      resolve(data.access_token);
    })
    .catch(error => {
      reject(error);
    });
    }
    );
}

export { getSpotifyAccessToken };