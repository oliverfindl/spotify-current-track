/**
 * spotify-current-track v1.0.0 (2018-07-21)
 * Copyright 2018 Oliver Findl
 * @license MIT
 */

"use strict";

/* Require all dependencies */
const { get, post } = require("axios");
const { intersection } = require("lodash");
const { stringify } = require("qs");

/* Define default options object */
const DEFAULT_OPTIONS = Object.freeze({
	_verbose: false,
	clientId: "",
	clientSecret: "",
	refreshToken: ""
});

/* Define OK HTTP status codes array for axios */
const AXIOS_OK_HTTP_STATUS_CODES = Object.freeze([200, 204, 304]);

/* Define required scopes array */
const REQUIRED_SCOPES = Object.freeze(["user-read-playback-state", "user-read-currently-playing"]);

/**
 * Simple Spotify Web API wrapper class
 */
class SpotifyAPI {

	/**
	 * Class constructor accepting options object
	 * @param {object} options 
	 */
	constructor(options = {}) {
		this.$options = Object.freeze(Object.assign({}, DEFAULT_OPTIONS, options));
		this._accessToken = "";
		this._accessTokenExpiration = 0;

		Object.keys(DEFAULT_OPTIONS).forEach(key => {
			if(!key.startsWith("_") && !this.$options[key]) {
				throw new Error(`Missing required option! [${key}]`);
			}
		});
	}

	/**
	 * Private method for obtaining current timestamp in seconds
	 * @returns {number} Current timestamp in seconds
	 */
	get _now() {
		if(this.$options._verbose) console.log("_now");
		return new Date().getTime() / 1e3;
	}

	/**
	 * Private method for obtaining access token
	 * @return {Promise} Promise object containing access token and expiration timestamp of token in seconds
	 */
	get _refresh() {
		if(this.$options._verbose) console.log("_refresh");
		return new Promise((resolve, reject) => {
			post("https://accounts.spotify.com/api/token", stringify({
				grant_type: "refresh_token",
				refresh_token: this.$options.refreshToken
			}), {
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
					"Authorization": "Basic " + new Buffer(this.$options.clientId + ":" + this.$options.clientSecret).toString("base64")
				}
			}).then(response => {
				if(!AXIOS_OK_HTTP_STATUS_CODES.includes(response.status)) reject(new Error(`Wrong HTTP status code! [${response.status}]`));
				if(!intersection(response.data.scope.split(/\s+/), REQUIRED_SCOPES).length) reject(new Error(`Missing required scope! [${REQUIRED_SCOPES.join(" and/or ")}]`));
				resolve({
					accessToken: this._accessToken = response.data.access_token,
					accessTokenExpiration: this._accessTokenExpiration = this._now + response.data.expires_in
				});
			}).catch(reject);
		});
	}

	/**
	 * Private method for obtaining current track object (only with valid access token)
	 * @return {Promise} Promise object with current track data
	 */
	get _currentTrack() {
		if(this.$options._verbose) console.log("_currentTrack");
		return new Promise((resolve, reject) => {
			get("https://api.spotify.com/v1/me/player/currently-playing", {
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": "Bearer " + this._accessToken
				}
			}).then(response => {
				if(!AXIOS_OK_HTTP_STATUS_CODES.includes(response.status)) reject(new Error(`Wrong HTTP status code! [${response.status}]`));
				resolve(Object.assign({
					is_playing: response.status !== 204
				}, response.data ? response.data : null));
			}).catch(reject);
		});
	}

	/**
	 * Method for obtaining current track object
	 * @return {Promise} Promise object with current track data
	 */
	get currentTrack() {
		if(this.$options._verbose) console.log("currentTrack");
		if(this._accessTokenExpiration > this._now) return this._currentTrack;
		return new Promise((resolve, reject) => this._refresh.then(() => resolve(this._currentTrack)).catch(reject));
	}

}

module.exports = SpotifyAPI;
