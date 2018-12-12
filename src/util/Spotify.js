const clientId = 'db3a8874dd2d4eda92758c0e163dc98d';
//const clientSecret = '2eb212bba09640fa9e08432ca4ad9b4a';
const redirectURI = 'http://localhost:3000';
//let accessToken = '';

const Spotify = {
  expirationTime: '',
  accessToken: '',
  getAccessTokenFromURL() {
    console.log("getAccessTokenFromURL");
    const parsedURL = window.location.href.match("/.*access_token=([a-zA-Z0-9_-]*)&.*$");
    if (parsedURL) {
      this.accessToken = parsedURL[1];
      return true;
    } else {
      return false;
    }
  },
  getAccessToken() {
    if (this.accessToken || this.getAccessTokenFromURL()) {
      console.log("Found it!");
      return this.accessToken;
    } else {
      console.log("Needs access token");
      window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);
    }
  },
  async search(term) {
    try {
      this.accessToken = this.getAccessToken();
      console.log(this.accessToken);
      const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      } throw new Error('Request Failed!');
    } catch(error) {
      console.log(error.message);
    }
  }
};

export default Spotify;
