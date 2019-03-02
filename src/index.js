/**
 * spotify-current-track v1.2.1 (2018-09-15)
 * Copyright 2019 Oliver Findl
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
	_timeout: 0,
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
	 * @param {Object} options Options object
	 */
	constructor(options = {}) {
		this.$options = Object.freeze(Object.assign({}, DEFAULT_OPTIONS, options));

		this._accessToken = "";
		this._accessTokenType = "";
		this._accessTokenExpiration = 0;
		this._market = "";

		Object.keys(DEFAULT_OPTIONS).forEach(key => {
			if(!key.startsWith("_") && !this.$options[key]) {
				throw new Error(`Missing required option! [${key}]`);
			}
		});
	}

	/**
	 * Private getter for current timestamp in seconds
	 * @returns {Number} Current timestamp in seconds
	 */
	get _now() {
		if(this.$options._verbose) console.log("[get]", "_now");

		return (new Date().getTime() / 1e3) | 0;
	}

	/**
	 * Private getter for obtaining new access token
	 * @return {Promise} Promise object containing refresh token, access token and expiration timestamp of access token in seconds
	 */
	get _newAccessToken() {
		if(this.$options._verbose) console.log("[get]", "_newAccessToken");

		return new Promise((resolve, reject) => {
			post("https://accounts.spotify.com/api/token", stringify({
				grant_type: "refresh_token",
				refresh_token: this.$options.refreshToken
			}), {
				timeout: this.$options._timeout,
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
					accessTokenType: this._accessTokenType = response.data.token_type,
					accessTokenExpiration: this._accessTokenExpiration = this._now + response.data.expires_in | 0
				});
			}).catch(reject);
		});
	}

	/**
	 * Private getter for obtaining current track object (only with valid access token)
	 * @return {Promise} Promise object with current track data
	 */
	get _currentTrack() {
		if(this.$options._verbose) console.log("get", "_currentTrack");

		return new Promise((resolve, reject) => {
			get("https://api.spotify.com/v1/me/player/currently-playing", {
				params: {
					market: this._market || null
				},
				timeout: this.$options._timeout,
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"Authorization": this._accessTokenType + " " + this._accessToken
				}
			}).then(response => {
				if(!AXIOS_OK_HTTP_STATUS_CODES.includes(response.status)) reject(new Error(`Wrong HTTP status code! [${response.status}]`));

				resolve(Object.assign({
					is_playing: response.status !== 204
				}, response.data || null));
			}).catch(reject);
		});
	}

	/**
	 * Getter for obtaining current track object
	 * @return {Promise} Promise object with current track data
	 */
	get currentTrack() {
		if(this.$options._verbose) console.log("[get]", "currentTrack");

		if(this._accessToken && this._accessTokenType && this._accessTokenExpiration && this._accessTokenExpiration > this._now) return this._currentTrack;

		return new Promise((resolve, reject) => this._newAccessToken.then(() => resolve(this._currentTrack)).catch(reject));
	}

	/**
	 * Getter for current market country code
	 * @returns {String} An ISO 3166-1 alpha-2 country code
	 */
	get market() {
		if(this.$options._verbose) console.log("[get]", "market");

		return this._market;
	}

	/**
	 * Setter for market country code
	 * @param {String} market An ISO 3166-1 alpha-2 country code
	 * @returns {String} An ISO 3166-1 alpha-2 country code
	 */
	set market(market = "") {
		if(this.$options._verbose) console.log("[set]", "market");

		if(!market || !/^[a-z]{2}$/i.test(market)) return;

		return this._market = market.toUpperCase();
	}

}

module.exports = SpotifyAPI;
