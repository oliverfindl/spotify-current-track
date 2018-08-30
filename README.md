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
	// [required] fill in your spotify credentials
	clientId: "<CLIENT_ID>",
	clientSecret: "<CLIENT_SECRET>",
	refreshToken: "<REFRESH_TOKEN>",
	// [optional] override default request timeout, default value is 0 (no timeout)
	_timeout: 1000 // milliseconds
});

// [optional] set market
spotify.market = "SK";

// get current track
spotify.currentTrack.then(track => {
	// ...
}).catch(console.error);
```

`clientId` and `clientSecret` can be obtained from your own [Spotify App](https://developer.spotify.com/documentation/general/guides/app-settings/).

`refreshToken` can be obtained by [Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow) with `user-read-currently-playing` and/or `user-read-playback-state` scope.

Set `market` if you want to apply [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/).

Example `track` object can be found [here](https://developer.spotify.com/documentation/web-api/reference/player/get-the-users-currently-playing-track/).

---

## License

[MIT](http://opensource.org/licenses/MIT)
