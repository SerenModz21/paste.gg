"use strict";
/*
 * Copyright © SerenModz21 2018 - 2021 All Rights Reserved.
 * Unauthorized distribution of any code within this project may result in consequences chosen by the Board Members.
 * Refer to the README for more information.
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _auth, _url;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasteGG = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const querystring_1 = require("querystring");
const interfaces_1 = require("./interfaces");
/**
 * The main class for interacting with the Paste.gg API
 * @module paste.gg
 * @class PasteGG
 */
class PasteGG {
    /**
     * Create a new instance of PasteGG
     * @param {string} auth Optional auth key
     * @param {Options} options Options for the paste server
     * @class PasteGG
     * @public
     */
    constructor(auth, options = {
        baseUrl: "https://api.paste.gg",
        mainUrl: "https://paste.gg",
        version: 1
    }) {
        _auth.set(this, void 0);
        _url.set(this, void 0);
        /**
         * The auth key
         * @type {string}
         * @private
         * @readonly
         */
        __classPrivateFieldSet(this, _auth, auth);
        /**
         * The options for the paste server
         * @type {Options}
         * @public
         * @readonly
         */
        this.options = options;
        /**
         * The version of the API wrapper
         * @type {string}
         * @public
         * @readonly
         */
        this.version = `v${require("../package.json").version}`;
        /**
         * The full URL for the API
         * @type {string}
         * @private
         * @readonly
         */
        __classPrivateFieldSet(this, _url, `${this.options.baseUrl}/v${this.options.version}`);
    }
    /**
     * Make a request to the API.
     * @param {keyof typeof Methods} method
     * @param {string} path
     * @param {object} body
     * @param {string} key
     * @template T
     * @returns {Promise<T>}
     * @private
     */
    async _request(method, path, body, key) {
        const headers = {};
        if (__classPrivateFieldGet(this, _auth))
            headers.Authorization = `Key ${__classPrivateFieldGet(this, _auth)}`;
        if (key === null || key === void 0 ? void 0 : key.length)
            headers.Authorization = `Key ${key}`;
        if (method !== "GET")
            headers["Content-Type"] = "application/json";
        let urlPath = `${__classPrivateFieldGet(this, _url)}${path}`;
        if (body && method === "GET")
            urlPath += `?${querystring_1.stringify(body)}`;
        const response = await node_fetch_1.default(urlPath, {
            method,
            headers,
            body: body && method !== "GET" ? JSON.stringify(body) : null
        });
        return response.json();
    }
    /**
     * Get an existing paste.
     * @param {string} id The ID of the paste.
     * @param {boolean} full Includes the contents of files if true.
     * @returns {Promise<Output>}
     * @public
     */
    async get(id, full = false) {
        return this._request(interfaces_1.Methods.GET, `/pastes/${id}`, { full });
    }
    /**
     * Create a new paste.
     * @param {Post} input The information to create the paste with.
     * @returns {Promise<Output>}
     * @public
     */
    async post(input) {
        const res = await this._request(interfaces_1.Methods.POST, "/pastes", input);
        if (res.result)
            res.result.url = `${this.options.mainUrl}/${res.result.id}`;
        return res;
    }
    /**
     * Deletes an existing paste.
     * @param {string} id The ID of the paste to delete.
     * @param {string} [key] Auth key or deletion key (leave blank if you have set the auth key in the constructor)
     * @returns {Promise<Output | void>}
     * @public
     */
    async delete(id, key) {
        var _a;
        if (!((_a = __classPrivateFieldGet(this, _auth)) === null || _a === void 0 ? void 0 : _a.length) && !(key === null || key === void 0 ? void 0 : key.length))
            throw new Error("An auth key or deletion key is needed for this endpoint!");
        const res = await this._request(interfaces_1.Methods.DELETE, `/pastes/${id}`, null, key);
        return res !== null && res !== void 0 ? res : { status: "success" };
    }
    /**
     * Update an existing paste.
     * @param {string} id The ID for the paste to update.
     * @param {Update} options The options you wish to update.
     * @returns {Promise<Output | void>}
     * @public
     */
    async update(id, options) {
        var _a;
        if (!((_a = __classPrivateFieldGet(this, _auth)) === null || _a === void 0 ? void 0 : _a.length))
            throw new Error("An auth key is required for this endpoint!");
        if (!options.name)
            options.name = null;
        return this._request(interfaces_1.Methods.PATCH, `/pastes/${id}`, options);
    }
}
exports.PasteGG = PasteGG;
_auth = new WeakMap(), _url = new WeakMap();
exports.default = PasteGG;
module.exports = PasteGG; // JS: default import
module.exports.PasteGG = PasteGG; // JS: deconstruct import
/**
 * The header options
 * @typedef {IHeader} IHeader
 * @property {string} [Content-Type] The request content type
 * @property {string} [Authorization] Authorization for the request
 */
/**
 * @typedef {Options} Options
 * @property {string} baseUrl The base URL of the API
 * @property {string} mainUrl The URL of the main website
 * @property {number} version The version of the API
 */
/**
 * @typedef {Result} Result
 * @property {string} id The ID of the created paste
 * @property {string} [name] The name of the created paste
 * @property {string} [url] The URL for the result
 * @property {Author} [author] The author of the paste
 * @property {string} [description] The description of the created paste
 * @property {public | unlisted | private} [visibility=unlisted] The visibility of the created paste
 * @property {string} created_at The date the paste was created
 * @property {string} updated_at The date the paste was last updated
 * @property {string} [expires] The date when the paste expires
 * @property {File[]} [files] The files used in the created paste
 * @property {string} [deletion_key] The deletion key of the created paste
 */
/**
 * @typedef {Output} Output
 * @property {string} status The output status
 * @property {Result} [result] The result data object
 * @property {string} [error] The error key
 * @property {string} [message] The error message
 */
/**
 * @typedef {Post} Post
 * @property {string} [name] The name of the paste
 * @property {string} [description] The description of the paste (must be less than 25 KiB)
 * @property {public | unlisted | private} [visibility=unlisted] The visibility of the paste
 * @property {string} [expires] The expiration date of the paste (must be a UTC ISO 8601 string)
 * @property {FileOut[]} files Array of files to add to the paste (at least one file)
 */
/**
 * @typedef {Author} Author
 * @property {string} [id] The ID of the author
 * @property {string} [username] The username of the author
 * @property {string} [name] The name of the author
 */
/**
 * @typedef {Update} Update
 * @property {string} [name] The new name of the post
 * @property {string} description The new description of the post
 */
/**
 * @typedef {File} File
 * @property {string} id The ID of the file
 * @property {string} name The name of the file
 * @property {string | null} highlight_language The syntax highlighting language used
 */
/**
 * @typedef {Content} Content
 * @property {text | base64 | gzip | xz} format The format of the file
 * @property {string} [highlight_language] The syntax highlighting language to use
 * @property {string} value The value of the file contents
 */
/**
 * @typedef {FileOut} FileOut
 * @property {string} [name] The name of the file
 * @property {Content} content The content of the file
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQWdDO0FBQ2hDLDZDQUFxRTtBQUNyRSw2Q0FBOEc7QUFFOUc7Ozs7R0FJRztBQUNILE1BQU0sT0FBTztJQU1YOzs7Ozs7T0FNRztJQUNILFlBQW1CLElBQWEsRUFBRSxVQUFtQjtRQUNuRCxPQUFPLEVBQUUsc0JBQXNCO1FBQy9CLE9BQU8sRUFBRSxrQkFBa0I7UUFDM0IsT0FBTyxFQUFFLENBQUM7S0FDWDtRQWhCRCx3QkFBdUI7UUFDdkIsdUJBQXNCO1FBZ0JwQjs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksU0FBUyxJQUFJLEVBQUM7UUFDbEI7Ozs7O1dBS0c7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2Qjs7Ozs7V0FLRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4RDs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUM7SUFDakUsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNLLEtBQUssQ0FBQyxRQUFRLENBQUksTUFBNEIsRUFBRSxJQUFZLEVBQUUsSUFBYSxFQUFFLEdBQVk7UUFDL0YsTUFBTSxPQUFPLEdBQVksRUFBRSxDQUFDO1FBQzVCO1lBQWdCLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxtQ0FBVSxFQUFFLENBQUM7UUFDNUQsSUFBSSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsTUFBTTtZQUFFLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUN0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OztHQUtHO0FBRUg7Ozs7R0FJRztBQUVIOzs7OztHQUtHO0FBRUg7Ozs7O0dBS0c7QUFFSDs7OztHQUlHIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCDCqSBTZXJlbk1vZHoyMSAyMDE4IC0gMjAyMSBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVW5hdXRob3JpemVkIGRpc3RyaWJ1dGlvbiBvZiBhbnkgY29kZSB3aXRoaW4gdGhpcyBwcm9qZWN0IG1heSByZXN1bHQgaW4gY29uc2VxdWVuY2VzIGNob3NlbiBieSB0aGUgQm9hcmQgTWVtYmVycy5cbiAqIFJlZmVyIHRvIHRoZSBSRUFETUUgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cblxuaW1wb3J0IGZldGNoICBmcm9tIFwibm9kZS1mZXRjaFwiO1xuaW1wb3J0IHsgc3RyaW5naWZ5LCBQYXJzZWRVcmxRdWVyeUlucHV0IGFzIElucHV0IH0gZnJvbSBcInF1ZXJ5c3RyaW5nXCJcbmltcG9ydCB7IE9wdGlvbnMsIElIZWFkZXIsIFJlc3VsdCwgT3V0cHV0LCBDb250ZW50LCBGaWxlLCBQb3N0LCBVcGRhdGUsIEF1dGhvciwgTWV0aG9kcyB9IGZyb20gXCIuL2ludGVyZmFjZXNcIjtcblxuLyoqXG4gKiBUaGUgbWFpbiBjbGFzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCB0aGUgUGFzdGUuZ2cgQVBJXG4gKiBAbW9kdWxlIHBhc3RlLmdnXG4gKiBAY2xhc3MgUGFzdGVHR1xuICovXG5jbGFzcyBQYXN0ZUdHIHtcbiAgcmVhZG9ubHkgI2F1dGg6IHN0cmluZztcbiAgcmVhZG9ubHkgI3VybDogc3RyaW5nO1xuICByZWFkb25seSBvcHRpb25zOiBPcHRpb25zO1xuICByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBQYXN0ZUdHXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoIE9wdGlvbmFsIGF1dGgga2V5XG4gICAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgcGFzdGUgc2VydmVyXG4gICAqIEBjbGFzcyBQYXN0ZUdHXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihhdXRoPzogc3RyaW5nLCBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgIGJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkucGFzdGUuZ2dcIixcbiAgICBtYWluVXJsOiBcImh0dHBzOi8vcGFzdGUuZ2dcIixcbiAgICB2ZXJzaW9uOiAxXG4gIH0pIHtcbiAgICAvKipcbiAgICAgKiBUaGUgYXV0aCBrZXlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy4jYXV0aCA9IGF1dGg7XG4gICAgLyoqXG4gICAgICogVGhlIG9wdGlvbnMgZm9yIHRoZSBwYXN0ZSBzZXJ2ZXJcbiAgICAgKiBAdHlwZSB7T3B0aW9uc31cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAvKipcbiAgICAgKiBUaGUgdmVyc2lvbiBvZiB0aGUgQVBJIHdyYXBwZXJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLnZlcnNpb24gPSBgdiR7cmVxdWlyZShcIi4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9ufWA7XG4gICAgLyoqXG4gICAgICogVGhlIGZ1bGwgVVJMIGZvciB0aGUgQVBJXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuI3VybCA9IGAke3RoaXMub3B0aW9ucy5iYXNlVXJsfS92JHt0aGlzLm9wdGlvbnMudmVyc2lvbn1gO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYSByZXF1ZXN0IHRvIHRoZSBBUEkuXG4gICAqIEBwYXJhbSB7a2V5b2YgdHlwZW9mIE1ldGhvZHN9IG1ldGhvZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICAgKiBAcGFyYW0ge29iamVjdH0gYm9keVxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEB0ZW1wbGF0ZSBUXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFQ+fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBfcmVxdWVzdDxUPihtZXRob2Q6IGtleW9mIHR5cGVvZiBNZXRob2RzLCBwYXRoOiBzdHJpbmcsIGJvZHk/OiBvYmplY3QsIGtleT86IHN0cmluZyk6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IGhlYWRlcnM6IElIZWFkZXIgPSB7fTtcbiAgICBpZiAodGhpcy4jYXV0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke3RoaXMuI2F1dGh9YDtcbiAgICBpZiAoa2V5Py5sZW5ndGgpIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBLZXkgJHtrZXl9YDtcbiAgICBpZiAobWV0aG9kICE9PSBcIkdFVFwiKSBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XG5cbiAgICBsZXQgdXJsUGF0aCA9IGAke3RoaXMuI3VybH0ke3BhdGh9YDtcbiAgICBpZiAoYm9keSAmJiBtZXRob2QgPT09IFwiR0VUXCIpIHVybFBhdGggKz0gYD8ke3N0cmluZ2lmeSg8SW5wdXQ+Ym9keSl9YDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsUGF0aCwge1xuICAgICAgbWV0aG9kLFxuICAgICAgaGVhZGVycyxcbiAgICAgIGJvZHk6IGJvZHkgJiYgbWV0aG9kICE9PSBcIkdFVFwiID8gSlNPTi5zdHJpbmdpZnkoYm9keSkgOiBudWxsXG4gICAgfSlcblxuICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdldCBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgcGFzdGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZnVsbCBJbmNsdWRlcyB0aGUgY29udGVudHMgb2YgZmlsZXMgaWYgdHJ1ZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0Pn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIGdldChpZDogc3RyaW5nLCBmdWxsOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPE91dHB1dD4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5HRVQsIGAvcGFzdGVzLyR7aWR9YCwgeyBmdWxsIH0pXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHBhc3RlLlxuICAgKiBAcGFyYW0ge1Bvc3R9IGlucHV0IFRoZSBpbmZvcm1hdGlvbiB0byBjcmVhdGUgdGhlIHBhc3RlIHdpdGguXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE91dHB1dD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBwb3N0KGlucHV0OiBQb3N0KTogUHJvbWlzZTxPdXRwdXQ+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5QT1NULCBcIi9wYXN0ZXNcIiwgaW5wdXQpXG4gICAgaWYgKHJlcy5yZXN1bHQpIHJlcy5yZXN1bHQudXJsID0gYCR7dGhpcy5vcHRpb25zLm1haW5Vcmx9LyR7cmVzLnJlc3VsdC5pZH1gXG4gICAgcmV0dXJuIHJlc1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIHBhc3RlIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIEF1dGgga2V5IG9yIGRlbGV0aW9uIGtleSAobGVhdmUgYmxhbmsgaWYgeW91IGhhdmUgc2V0IHRoZSBhdXRoIGtleSBpbiB0aGUgY29uc3RydWN0b3IpXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE91dHB1dCB8IHZvaWQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGVsZXRlKGlkOiBzdHJpbmcsIGtleT86IHN0cmluZyk6IFByb21pc2U8T3V0cHV0IHwgdm9pZD4ge1xuICAgIGlmICghdGhpcy4jYXV0aD8ubGVuZ3RoICYmICFrZXk/Lmxlbmd0aClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGF1dGgga2V5IG9yIGRlbGV0aW9uIGtleSBpcyBuZWVkZWQgZm9yIHRoaXMgZW5kcG9pbnQhXCIpXG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5ERUxFVEUsIGAvcGFzdGVzLyR7aWR9YCwgbnVsbCwga2V5KVxuICAgIHJldHVybiByZXMgPz8geyBzdGF0dXM6IFwic3VjY2Vzc1wiIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgZm9yIHRoZSBwYXN0ZSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7VXBkYXRlfSBvcHRpb25zIFRoZSBvcHRpb25zIHlvdSB3aXNoIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0IHwgdm9pZD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyB1cGRhdGUoaWQ6IHN0cmluZywgb3B0aW9uczogVXBkYXRlKTogUHJvbWlzZTxPdXRwdXQgfCB2b2lkPiB7XG4gICAgaWYgKCF0aGlzLiNhdXRoPy5sZW5ndGgpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbiBhdXRoIGtleSBpcyByZXF1aXJlZCBmb3IgdGhpcyBlbmRwb2ludCFcIik7XG5cbiAgICBpZiAoIW9wdGlvbnMubmFtZSkgb3B0aW9ucy5uYW1lID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdDxPdXRwdXQ+KE1ldGhvZHMuUEFUQ0gsIGAvcGFzdGVzLyR7aWR9YCwgb3B0aW9ucylcbiAgfVxufVxuXG4vKipcbiAqIEBleHBvcnRzIHBhc3RlLmdnXG4gKi9cblxuZXhwb3J0IHsgUGFzdGVHRyB9O1xuZXhwb3J0IGRlZmF1bHQgUGFzdGVHRztcbm1vZHVsZS5leHBvcnRzID0gUGFzdGVHRzsgLy8gSlM6IGRlZmF1bHQgaW1wb3J0XG5tb2R1bGUuZXhwb3J0cy5QYXN0ZUdHID0gUGFzdGVHRzsgLy8gSlM6IGRlY29uc3RydWN0IGltcG9ydFxuXG4vKipcbiAqIFRoZSBoZWFkZXIgb3B0aW9uc1xuICogQHR5cGVkZWYge0lIZWFkZXJ9IElIZWFkZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbQ29udGVudC1UeXBlXSBUaGUgcmVxdWVzdCBjb250ZW50IHR5cGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbQXV0aG9yaXphdGlvbl0gQXV0aG9yaXphdGlvbiBmb3IgdGhlIHJlcXVlc3RcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPcHRpb25zfSBPcHRpb25zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmFzZVVybCBUaGUgYmFzZSBVUkwgb2YgdGhlIEFQSVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1haW5VcmwgVGhlIFVSTCBvZiB0aGUgbWFpbiB3ZWJzaXRlXG4gKiBAcHJvcGVydHkge251bWJlcn0gdmVyc2lvbiBUaGUgdmVyc2lvbiBvZiB0aGUgQVBJXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7UmVzdWx0fSBSZXN1bHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdXJsXSBUaGUgVVJMIGZvciB0aGUgcmVzdWx0XG4gKiBAcHJvcGVydHkge0F1dGhvcn0gW2F1dGhvcl0gVGhlIGF1dGhvciBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNyZWF0ZWRfYXQgVGhlIGRhdGUgdGhlIHBhc3RlIHdhcyBjcmVhdGVkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdXBkYXRlZF9hdCBUaGUgZGF0ZSB0aGUgcGFzdGUgd2FzIGxhc3QgdXBkYXRlZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtleHBpcmVzXSBUaGUgZGF0ZSB3aGVuIHRoZSBwYXN0ZSBleHBpcmVzXG4gKiBAcHJvcGVydHkge0ZpbGVbXX0gW2ZpbGVzXSBUaGUgZmlsZXMgdXNlZCBpbiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZWxldGlvbl9rZXldIFRoZSBkZWxldGlvbiBrZXkgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPdXRwdXR9IE91dHB1dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHN0YXR1cyBUaGUgb3V0cHV0IHN0YXR1c1xuICogQHByb3BlcnR5IHtSZXN1bHR9IFtyZXN1bHRdIFRoZSByZXN1bHQgZGF0YSBvYmplY3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXJyb3JdIFRoZSBlcnJvciBrZXlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbWVzc2FnZV0gVGhlIGVycm9yIG1lc3NhZ2VcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtQb3N0fSBQb3N0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBwYXN0ZSAobXVzdCBiZSBsZXNzIHRoYW4gMjUgS2lCKVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXhwaXJlc10gVGhlIGV4cGlyYXRpb24gZGF0ZSBvZiB0aGUgcGFzdGUgKG11c3QgYmUgYSBVVEMgSVNPIDg2MDEgc3RyaW5nKVxuICogQHByb3BlcnR5IHtGaWxlT3V0W119IGZpbGVzIEFycmF5IG9mIGZpbGVzIHRvIGFkZCB0byB0aGUgcGFzdGUgKGF0IGxlYXN0IG9uZSBmaWxlKVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0F1dGhvcn0gQXV0aG9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2lkXSBUaGUgSUQgb2YgdGhlIGF1dGhvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt1c2VybmFtZV0gVGhlIHVzZXJuYW1lIG9mIHRoZSBhdXRob3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGF1dGhvclxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1VwZGF0ZX0gVXBkYXRlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuZXcgbmFtZSBvZiB0aGUgcG9zdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc2NyaXB0aW9uIFRoZSBuZXcgZGVzY3JpcHRpb24gb2YgdGhlIHBvc3RcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtGaWxlfSBGaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmcgfCBudWxsfSBoaWdobGlnaHRfbGFuZ3VhZ2UgVGhlIHN5bnRheCBoaWdobGlnaHRpbmcgbGFuZ3VhZ2UgdXNlZFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0NvbnRlbnR9IENvbnRlbnRcbiAqIEBwcm9wZXJ0eSB7dGV4dCB8IGJhc2U2NCB8IGd6aXAgfCB4en0gZm9ybWF0IFRoZSBmb3JtYXQgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaGlnaGxpZ2h0X2xhbmd1YWdlXSBUaGUgc3ludGF4IGhpZ2hsaWdodGluZyBsYW5ndWFnZSB0byB1c2VcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGZpbGUgY29udGVudHNcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtGaWxlT3V0fSBGaWxlT3V0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge0NvbnRlbnR9IGNvbnRlbnQgVGhlIGNvbnRlbnQgb2YgdGhlIGZpbGVcbiAqL1xuIl19