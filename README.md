# spotify-current-track

[![npm](https://img.shields.io/npm/v/spotify-current-track.svg?style=flat)](https://www.npmjs.com/package/spotify-current-track)
[![npm](https://img.shields.io/npm/dt/spotify-current-track.svg?style=flat)](https://www.npmjs.com/package/spotify-current-track)
[![npm](https://img.shields.io/npm/l/spotify-current-track.svg?style=flat)](https://www.npmjs.com/package/spotify-current-track)
[![paypal](https://img.shields.io/badge/donate-paypal-blue.svg?colorB=0070ba&style=flat)](https://paypal.me/oliverfindl)

Simple wrapper for obtaining current track from [Spotify](https://www.spotify.com/) Web API.

---

## Install

Via [npm](https://npmjs.com/) [[package](https://www.npmjs.com/package/spotify-current-track)]:
```bash
$ npm install spotify-current-track
```

Via [yarn](https://yarnpkg.com/en/) [[package](https://yarnpkg.com/en/package/spotify-current-track)]:
```bash
$ yarn add spotify-current-track
```

## Usage

```javascript
// require lib
const SpotifyAPI = require("spotify-current-track");

// init lib
const spotify = new SpotifyAPI({
	clientId: "<CLIENT_ID>",
	clientSecret: "<CLIENT_SECRET>",
	refreshToken: "<REFRESH_TOKEN>"
});

// get current track
spotify.currentTrack.then(track => {
	// ...
}).catch(console.error);
```

`clientId` and `clientSecret` can be obtained from your own [Spotify](https://www.spotify.com/) application [[more info](https://developer.spotify.com/documentation/general/guides/app-settings/)].

`refreshToken` can be obtained with [Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow) [[more info](https://developer.spotify.com/documentation/web-api/quick-start/)].

Example `track` object can be found [here](https://developer.spotify.com/documentation/web-api/reference/player/get-the-users-currently-playing-track/).

---

## License

[MIT](http://opensource.org/licenses/MIT)
