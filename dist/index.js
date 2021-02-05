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
module.exports = PasteGG;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQWdDO0FBQ2hDLDZDQUFxRTtBQUNyRSw2Q0FBOEc7QUFFOUc7Ozs7R0FJRztBQUNILE1BQU0sT0FBTztJQU1YOzs7Ozs7T0FNRztJQUNILFlBQW1CLElBQWEsRUFBRSxVQUFtQjtRQUNuRCxPQUFPLEVBQUUsc0JBQXNCO1FBQy9CLE9BQU8sRUFBRSxrQkFBa0I7UUFDM0IsT0FBTyxFQUFFLENBQUM7S0FDWDtRQWhCRCx3QkFBdUI7UUFDdkIsdUJBQXNCO1FBZ0JwQjs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksU0FBUyxJQUFJLEVBQUM7UUFDbEI7Ozs7O1dBS0c7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2Qjs7Ozs7V0FLRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4RDs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUM7SUFDakUsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNLLEtBQUssQ0FBQyxRQUFRLENBQUksTUFBNEIsRUFBRSxJQUFZLEVBQUUsSUFBYSxFQUFFLEdBQVk7UUFDL0YsTUFBTSxPQUFPLEdBQVksRUFBRSxDQUFDO1FBQzVCO1lBQWdCLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxtQ0FBVSxFQUFFLENBQUM7UUFDNUQsSUFBSSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsTUFBTTtZQUFFLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUN0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Q29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IMKpIFNlcmVuTW9kejIxIDIwMTggLSAyMDIxIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBVbmF1dGhvcml6ZWQgZGlzdHJpYnV0aW9uIG9mIGFueSBjb2RlIHdpdGhpbiB0aGlzIHByb2plY3QgbWF5IHJlc3VsdCBpbiBjb25zZXF1ZW5jZXMgY2hvc2VuIGJ5IHRoZSBCb2FyZCBNZW1iZXJzLlxuICogUmVmZXIgdG8gdGhlIFJFQURNRSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuXG5pbXBvcnQgZmV0Y2ggIGZyb20gXCJub2RlLWZldGNoXCI7XG5pbXBvcnQgeyBzdHJpbmdpZnksIFBhcnNlZFVybFF1ZXJ5SW5wdXQgYXMgSW5wdXQgfSBmcm9tIFwicXVlcnlzdHJpbmdcIlxuaW1wb3J0IHsgT3B0aW9ucywgSUhlYWRlciwgUmVzdWx0LCBPdXRwdXQsIENvbnRlbnQsIEZpbGUsIFBvc3QsIFVwZGF0ZSwgQXV0aG9yLCBNZXRob2RzIH0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuXG4vKipcbiAqIFRoZSBtYWluIGNsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIHRoZSBQYXN0ZS5nZyBBUElcbiAqIEBtb2R1bGUgcGFzdGUuZ2dcbiAqIEBjbGFzcyBQYXN0ZUdHXG4gKi9cbmNsYXNzIFBhc3RlR0cge1xuICByZWFkb25seSAjYXV0aDogc3RyaW5nO1xuICByZWFkb25seSAjdXJsOiBzdHJpbmc7XG4gIHJlYWRvbmx5IG9wdGlvbnM6IE9wdGlvbnM7XG4gIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIFBhc3RlR0dcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1dGggT3B0aW9uYWwgYXV0aCBrZXlcbiAgICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBwYXN0ZSBzZXJ2ZXJcbiAgICogQGNsYXNzIFBhc3RlR0dcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKGF1dGg/OiBzdHJpbmcsIG9wdGlvbnM6IE9wdGlvbnMgPSB7XG4gICAgYmFzZVVybDogXCJodHRwczovL2FwaS5wYXN0ZS5nZ1wiLFxuICAgIG1haW5Vcmw6IFwiaHR0cHM6Ly9wYXN0ZS5nZ1wiLFxuICAgIHZlcnNpb246IDFcbiAgfSkge1xuICAgIC8qKlxuICAgICAqIFRoZSBhdXRoIGtleVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLiNhdXRoID0gYXV0aDtcbiAgICAvKipcbiAgICAgKiBUaGUgb3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgICAqIEB0eXBlIHtPcHRpb25zfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBBUEkgd3JhcHBlclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMudmVyc2lvbiA9IGB2JHtyZXF1aXJlKFwiLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259YDtcbiAgICAvKipcbiAgICAgKiBUaGUgZnVsbCBVUkwgZm9yIHRoZSBBUElcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy4jdXJsID0gYCR7dGhpcy5vcHRpb25zLmJhc2VVcmx9L3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufWA7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhIHJlcXVlc3QgdG8gdGhlIEFQSS5cbiAgICogQHBhcmFtIHtrZXlvZiB0eXBlb2YgTWV0aG9kc30gbWV0aG9kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBib2R5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHRlbXBsYXRlIFRcbiAgICogQHJldHVybnMge1Byb21pc2U8VD59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9yZXF1ZXN0PFQ+KG1ldGhvZDoga2V5b2YgdHlwZW9mIE1ldGhvZHMsIHBhdGg6IHN0cmluZywgYm9keT86IG9iamVjdCwga2V5Pzogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgaGVhZGVyczogSUhlYWRlciA9IHt9O1xuICAgIGlmICh0aGlzLiNhdXRoKSBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgS2V5ICR7dGhpcy4jYXV0aH1gO1xuICAgIGlmIChrZXk/Lmxlbmd0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke2tleX1gO1xuICAgIGlmIChtZXRob2QgIT09IFwiR0VUXCIpIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcblxuICAgIGxldCB1cmxQYXRoID0gYCR7dGhpcy4jdXJsfSR7cGF0aH1gO1xuICAgIGlmIChib2R5ICYmIG1ldGhvZCA9PT0gXCJHRVRcIikgdXJsUGF0aCArPSBgPyR7c3RyaW5naWZ5KDxJbnB1dD5ib2R5KX1gO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmxQYXRoLCB7XG4gICAgICBtZXRob2QsXG4gICAgICBoZWFkZXJzLFxuICAgICAgYm9keTogYm9keSAmJiBtZXRob2QgIT09IFwiR0VUXCIgPyBKU09OLnN0cmluZ2lmeShib2R5KSA6IG51bGxcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICB9XG5cblxuICAvKipcbiAgICogR2V0IGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBmdWxsIEluY2x1ZGVzIHRoZSBjb250ZW50cyBvZiBmaWxlcyBpZiB0cnVlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZ2V0KGlkOiBzdHJpbmcsIGZ1bGw6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8T3V0cHV0PiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLkdFVCwgYC9wYXN0ZXMvJHtpZH1gLCB7IGZ1bGwgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgcGFzdGUuXG4gICAqIEBwYXJhbSB7UG9zdH0gaW5wdXQgVGhlIGluZm9ybWF0aW9uIHRvIGNyZWF0ZSB0aGUgcGFzdGUgd2l0aC5cbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0Pn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHBvc3QoaW5wdXQ6IFBvc3QpOiBQcm9taXNlPE91dHB1dD4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLlBPU1QsIFwiL3Bhc3Rlc1wiLCBpbnB1dClcbiAgICBpZiAocmVzLnJlc3VsdCkgcmVzLnJlc3VsdC51cmwgPSBgJHt0aGlzLm9wdGlvbnMubWFpblVybH0vJHtyZXMucmVzdWx0LmlkfWBcbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgcGFzdGUgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gQXV0aCBrZXkgb3IgZGVsZXRpb24ga2V5IChsZWF2ZSBibGFuayBpZiB5b3UgaGF2ZSBzZXQgdGhlIGF1dGgga2V5IGluIHRoZSBjb25zdHJ1Y3RvcilcbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0IHwgdm9pZD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBkZWxldGUoaWQ6IHN0cmluZywga2V5Pzogc3RyaW5nKTogUHJvbWlzZTxPdXRwdXQgfCB2b2lkPiB7XG4gICAgaWYgKCF0aGlzLiNhdXRoPy5sZW5ndGggJiYgIWtleT8ubGVuZ3RoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gYXV0aCBrZXkgb3IgZGVsZXRpb24ga2V5IGlzIG5lZWRlZCBmb3IgdGhpcyBlbmRwb2ludCFcIilcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLkRFTEVURSwgYC9wYXN0ZXMvJHtpZH1gLCBudWxsLCBrZXkpXG4gICAgcmV0dXJuIHJlcyA/PyB7IHN0YXR1czogXCJzdWNjZXNzXCIgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBmb3IgdGhlIHBhc3RlIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtVcGRhdGV9IG9wdGlvbnMgVGhlIG9wdGlvbnMgeW91IHdpc2ggdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQgfCB2b2lkPn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHVwZGF0ZShpZDogc3RyaW5nLCBvcHRpb25zOiBVcGRhdGUpOiBQcm9taXNlPE91dHB1dCB8IHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuI2F1dGg/Lmxlbmd0aClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGF1dGgga2V5IGlzIHJlcXVpcmVkIGZvciB0aGlzIGVuZHBvaW50IVwiKTtcblxuICAgIGlmICghb3B0aW9ucy5uYW1lKSBvcHRpb25zLm5hbWUgPSBudWxsO1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5QQVRDSCwgYC9wYXN0ZXMvJHtpZH1gLCBvcHRpb25zKVxuICB9XG59XG5cbi8qKlxuICogQGV4cG9ydHMgcGFzdGUuZ2dcbiAqL1xuXG5leHBvcnQgeyBQYXN0ZUdHIH07XG5leHBvcnQgZGVmYXVsdCBQYXN0ZUdHO1xubW9kdWxlLmV4cG9ydHMgPSBQYXN0ZUdHO1xuXG4vKipcbiAqIFRoZSBoZWFkZXIgb3B0aW9uc1xuICogQHR5cGVkZWYge0lIZWFkZXJ9IElIZWFkZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbQ29udGVudC1UeXBlXSBUaGUgcmVxdWVzdCBjb250ZW50IHR5cGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbQXV0aG9yaXphdGlvbl0gQXV0aG9yaXphdGlvbiBmb3IgdGhlIHJlcXVlc3RcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPcHRpb25zfSBPcHRpb25zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmFzZVVybCBUaGUgYmFzZSBVUkwgb2YgdGhlIEFQSVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1haW5VcmwgVGhlIFVSTCBvZiB0aGUgbWFpbiB3ZWJzaXRlXG4gKiBAcHJvcGVydHkge251bWJlcn0gdmVyc2lvbiBUaGUgdmVyc2lvbiBvZiB0aGUgQVBJXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7UmVzdWx0fSBSZXN1bHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdXJsXSBUaGUgVVJMIGZvciB0aGUgcmVzdWx0XG4gKiBAcHJvcGVydHkge0F1dGhvcn0gW2F1dGhvcl0gVGhlIGF1dGhvciBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNyZWF0ZWRfYXQgVGhlIGRhdGUgdGhlIHBhc3RlIHdhcyBjcmVhdGVkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdXBkYXRlZF9hdCBUaGUgZGF0ZSB0aGUgcGFzdGUgd2FzIGxhc3QgdXBkYXRlZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtleHBpcmVzXSBUaGUgZGF0ZSB3aGVuIHRoZSBwYXN0ZSBleHBpcmVzXG4gKiBAcHJvcGVydHkge0ZpbGVbXX0gW2ZpbGVzXSBUaGUgZmlsZXMgdXNlZCBpbiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZWxldGlvbl9rZXldIFRoZSBkZWxldGlvbiBrZXkgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPdXRwdXR9IE91dHB1dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHN0YXR1cyBUaGUgb3V0cHV0IHN0YXR1c1xuICogQHByb3BlcnR5IHtSZXN1bHR9IFtyZXN1bHRdIFRoZSByZXN1bHQgZGF0YSBvYmplY3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXJyb3JdIFRoZSBlcnJvciBrZXlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbWVzc2FnZV0gVGhlIGVycm9yIG1lc3NhZ2VcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtQb3N0fSBQb3N0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBwYXN0ZSAobXVzdCBiZSBsZXNzIHRoYW4gMjUgS2lCKVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXhwaXJlc10gVGhlIGV4cGlyYXRpb24gZGF0ZSBvZiB0aGUgcGFzdGUgKG11c3QgYmUgYSBVVEMgSVNPIDg2MDEgc3RyaW5nKVxuICogQHByb3BlcnR5IHtGaWxlT3V0W119IGZpbGVzIEFycmF5IG9mIGZpbGVzIHRvIGFkZCB0byB0aGUgcGFzdGUgKGF0IGxlYXN0IG9uZSBmaWxlKVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0F1dGhvcn0gQXV0aG9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2lkXSBUaGUgSUQgb2YgdGhlIGF1dGhvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt1c2VybmFtZV0gVGhlIHVzZXJuYW1lIG9mIHRoZSBhdXRob3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGF1dGhvclxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1VwZGF0ZX0gVXBkYXRlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuZXcgbmFtZSBvZiB0aGUgcG9zdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc2NyaXB0aW9uIFRoZSBuZXcgZGVzY3JpcHRpb24gb2YgdGhlIHBvc3RcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtGaWxlfSBGaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmcgfCBudWxsfSBoaWdobGlnaHRfbGFuZ3VhZ2UgVGhlIHN5bnRheCBoaWdobGlnaHRpbmcgbGFuZ3VhZ2UgdXNlZFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0NvbnRlbnR9IENvbnRlbnRcbiAqIEBwcm9wZXJ0eSB7dGV4dCB8IGJhc2U2NCB8IGd6aXAgfCB4en0gZm9ybWF0IFRoZSBmb3JtYXQgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaGlnaGxpZ2h0X2xhbmd1YWdlXSBUaGUgc3ludGF4IGhpZ2hsaWdodGluZyBsYW5ndWFnZSB0byB1c2VcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGZpbGUgY29udGVudHNcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtGaWxlT3V0fSBGaWxlT3V0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge0NvbnRlbnR9IGNvbnRlbnQgVGhlIGNvbnRlbnQgb2YgdGhlIGZpbGVcbiAqL1xuIl19