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
        version: 1,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQWdDO0FBQ2hDLDZDQUFxRTtBQUNyRSw2Q0FHc0I7QUFFdEI7Ozs7R0FJRztBQUNILE1BQU0sT0FBTztJQU1YOzs7Ozs7T0FNRztJQUNILFlBQ0UsSUFBYSxFQUNiLFVBQW1CO1FBQ2pCLE9BQU8sRUFBRSxzQkFBc0I7UUFDL0IsT0FBTyxFQUFFLGtCQUFrQjtRQUMzQixPQUFPLEVBQUUsQ0FBQztLQUNYO1FBbEJILHdCQUF1QjtRQUN2Qix1QkFBc0I7UUFtQnBCOzs7OztXQUtHO1FBQ0gsdUJBQUEsSUFBSSxTQUFTLElBQUksRUFBQztRQUNsQjs7Ozs7V0FLRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCOzs7OztXQUtHO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hEOzs7OztXQUtHO1FBQ0gsdUJBQUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0ssS0FBSyxDQUFDLFFBQVEsQ0FBSSxNQUE0QixFQUFFLElBQVksRUFBRSxJQUFhLEVBQUUsR0FBWTtRQUMvRixNQUFNLE9BQU8sR0FBWSxFQUFFLENBQUM7UUFDNUI7WUFBZ0IsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLG1DQUFVLEVBQUUsQ0FBQztRQUM1RCxJQUFJLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxNQUFNO1lBQUUsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ3RE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b2R6MjEgMjAxOCAtIDIwMjEgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFVuYXV0aG9yaXplZCBkaXN0cmlidXRpb24gb2YgYW55IGNvZGUgd2l0aGluIHRoaXMgcHJvamVjdCBtYXkgcmVzdWx0IGluIGNvbnNlcXVlbmNlcyBjaG9zZW4gYnkgdGhlIEJvYXJkIE1lbWJlcnMuXG4gKiBSZWZlciB0byB0aGUgUkVBRE1FIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICovXG5cbmltcG9ydCBmZXRjaCAgZnJvbSBcIm5vZGUtZmV0Y2hcIjtcbmltcG9ydCB7IHN0cmluZ2lmeSwgUGFyc2VkVXJsUXVlcnlJbnB1dCBhcyBJbnB1dCB9IGZyb20gXCJxdWVyeXN0cmluZ1wiXG5pbXBvcnQge1xuICBPcHRpb25zLCBJSGVhZGVyLCBSZXN1bHQsIE91dHB1dCwgQ29udGVudCxcbiAgRmlsZSwgUG9zdCwgVXBkYXRlLCBBdXRob3IsIE1ldGhvZHNcbn0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuXG4vKipcbiAqIFRoZSBtYWluIGNsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIHRoZSBQYXN0ZS5nZyBBUElcbiAqIEBtb2R1bGUgcGFzdGUuZ2dcbiAqIEBjbGFzcyBQYXN0ZUdHXG4gKi9cbmNsYXNzIFBhc3RlR0cge1xuICByZWFkb25seSAjYXV0aDogc3RyaW5nO1xuICByZWFkb25seSAjdXJsOiBzdHJpbmc7XG4gIHJlYWRvbmx5IG9wdGlvbnM6IE9wdGlvbnM7XG4gIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIFBhc3RlR0dcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1dGggT3B0aW9uYWwgYXV0aCBrZXlcbiAgICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBwYXN0ZSBzZXJ2ZXJcbiAgICogQGNsYXNzIFBhc3RlR0dcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIGF1dGg/OiBzdHJpbmcsXG4gICAgb3B0aW9uczogT3B0aW9ucyA9IHtcbiAgICAgIGJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkucGFzdGUuZ2dcIixcbiAgICAgIG1haW5Vcmw6IFwiaHR0cHM6Ly9wYXN0ZS5nZ1wiLFxuICAgICAgdmVyc2lvbjogMSxcbiAgICB9XG4gICkge1xuICAgIC8qKlxuICAgICAqIFRoZSBhdXRoIGtleVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLiNhdXRoID0gYXV0aDtcbiAgICAvKipcbiAgICAgKiBUaGUgb3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgICAqIEB0eXBlIHtPcHRpb25zfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBBUEkgd3JhcHBlclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMudmVyc2lvbiA9IGB2JHtyZXF1aXJlKFwiLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259YDtcbiAgICAvKipcbiAgICAgKiBUaGUgZnVsbCBVUkwgZm9yIHRoZSBBUElcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy4jdXJsID0gYCR7dGhpcy5vcHRpb25zLmJhc2VVcmx9L3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufWA7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhIHJlcXVlc3QgdG8gdGhlIEFQSS5cbiAgICogQHBhcmFtIHtrZXlvZiB0eXBlb2YgTWV0aG9kc30gbWV0aG9kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBib2R5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHRlbXBsYXRlIFRcbiAgICogQHJldHVybnMge1Byb21pc2U8VD59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9yZXF1ZXN0PFQ+KG1ldGhvZDoga2V5b2YgdHlwZW9mIE1ldGhvZHMsIHBhdGg6IHN0cmluZywgYm9keT86IG9iamVjdCwga2V5Pzogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgaGVhZGVyczogSUhlYWRlciA9IHt9O1xuICAgIGlmICh0aGlzLiNhdXRoKSBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgS2V5ICR7dGhpcy4jYXV0aH1gO1xuICAgIGlmIChrZXk/Lmxlbmd0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke2tleX1gO1xuICAgIGlmIChtZXRob2QgIT09IFwiR0VUXCIpIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcblxuICAgIGxldCB1cmxQYXRoID0gYCR7dGhpcy4jdXJsfSR7cGF0aH1gO1xuICAgIGlmIChib2R5ICYmIG1ldGhvZCA9PT0gXCJHRVRcIikgdXJsUGF0aCArPSBgPyR7c3RyaW5naWZ5KDxJbnB1dD5ib2R5KX1gO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmxQYXRoLCB7XG4gICAgICBtZXRob2QsXG4gICAgICBoZWFkZXJzLFxuICAgICAgYm9keTogYm9keSAmJiBtZXRob2QgIT09IFwiR0VUXCIgPyBKU09OLnN0cmluZ2lmeShib2R5KSA6IG51bGxcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICB9XG5cblxuICAvKipcbiAgICogR2V0IGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBmdWxsIEluY2x1ZGVzIHRoZSBjb250ZW50cyBvZiBmaWxlcyBpZiB0cnVlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZ2V0KGlkOiBzdHJpbmcsIGZ1bGw6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8T3V0cHV0PiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLkdFVCwgYC9wYXN0ZXMvJHtpZH1gLCB7IGZ1bGwgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgcGFzdGUuXG4gICAqIEBwYXJhbSB7UG9zdH0gaW5wdXQgVGhlIGluZm9ybWF0aW9uIHRvIGNyZWF0ZSB0aGUgcGFzdGUgd2l0aC5cbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0Pn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHBvc3QoaW5wdXQ6IFBvc3QpOiBQcm9taXNlPE91dHB1dD4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLlBPU1QsIFwiL3Bhc3Rlc1wiLCBpbnB1dClcbiAgICBpZiAocmVzLnJlc3VsdCkgcmVzLnJlc3VsdC51cmwgPSBgJHt0aGlzLm9wdGlvbnMubWFpblVybH0vJHtyZXMucmVzdWx0LmlkfWBcbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgcGFzdGUgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gQXV0aCBrZXkgb3IgZGVsZXRpb24ga2V5IChsZWF2ZSBibGFuayBpZiB5b3UgaGF2ZSBzZXQgdGhlIGF1dGgga2V5IGluIHRoZSBjb25zdHJ1Y3RvcilcbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0IHwgdm9pZD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBkZWxldGUoaWQ6IHN0cmluZywga2V5Pzogc3RyaW5nKTogUHJvbWlzZTxPdXRwdXQgfCB2b2lkPiB7XG4gICAgaWYgKCF0aGlzLiNhdXRoPy5sZW5ndGggJiYgIWtleT8ubGVuZ3RoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gYXV0aCBrZXkgb3IgZGVsZXRpb24ga2V5IGlzIG5lZWRlZCBmb3IgdGhpcyBlbmRwb2ludCFcIilcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLkRFTEVURSwgYC9wYXN0ZXMvJHtpZH1gLCBudWxsLCBrZXkpXG4gICAgcmV0dXJuIHJlcyA/PyB7IHN0YXR1czogXCJzdWNjZXNzXCIgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBmb3IgdGhlIHBhc3RlIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtVcGRhdGV9IG9wdGlvbnMgVGhlIG9wdGlvbnMgeW91IHdpc2ggdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQgfCB2b2lkPn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHVwZGF0ZShpZDogc3RyaW5nLCBvcHRpb25zOiBVcGRhdGUpOiBQcm9taXNlPE91dHB1dCB8IHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuI2F1dGg/Lmxlbmd0aClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGF1dGgga2V5IGlzIHJlcXVpcmVkIGZvciB0aGlzIGVuZHBvaW50IVwiKTtcblxuICAgIGlmICghb3B0aW9ucy5uYW1lKSBvcHRpb25zLm5hbWUgPSBudWxsO1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5QQVRDSCwgYC9wYXN0ZXMvJHtpZH1gLCBvcHRpb25zKVxuICB9XG59XG5cbi8qKlxuICogQGV4cG9ydHMgcGFzdGUuZ2dcbiAqL1xuXG5leHBvcnQgeyBQYXN0ZUdHIH1cbmV4cG9ydCBkZWZhdWx0IFBhc3RlR0dcblxuLyoqXG4gKiBUaGUgaGVhZGVyIG9wdGlvbnNcbiAqIEB0eXBlZGVmIHtJSGVhZGVyfSBJSGVhZGVyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW0NvbnRlbnQtVHlwZV0gVGhlIHJlcXVlc3QgY29udGVudCB0eXBlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW0F1dGhvcml6YXRpb25dIEF1dGhvcml6YXRpb24gZm9yIHRoZSByZXF1ZXN0XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T3B0aW9uc30gT3B0aW9uc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGJhc2VVcmwgVGhlIGJhc2UgVVJMIG9mIHRoZSBBUElcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtYWluVXJsIFRoZSBVUkwgb2YgdGhlIG1haW4gd2Vic2l0ZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHZlcnNpb24gVGhlIHZlcnNpb24gb2YgdGhlIEFQSVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1Jlc3VsdH0gUmVzdWx0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3VybF0gVGhlIFVSTCBmb3IgdGhlIHJlc3VsdFxuICogQHByb3BlcnR5IHtBdXRob3J9IFthdXRob3JdIFRoZSBhdXRob3Igb2YgdGhlIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7cHVibGljIHwgdW5saXN0ZWQgfCBwcml2YXRlfSBbdmlzaWJpbGl0eT11bmxpc3RlZF0gVGhlIHZpc2liaWxpdHkgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjcmVhdGVkX2F0IFRoZSBkYXRlIHRoZSBwYXN0ZSB3YXMgY3JlYXRlZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHVwZGF0ZWRfYXQgVGhlIGRhdGUgdGhlIHBhc3RlIHdhcyBsYXN0IHVwZGF0ZWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXhwaXJlc10gVGhlIGRhdGUgd2hlbiB0aGUgcGFzdGUgZXhwaXJlc1xuICogQHByb3BlcnR5IHtGaWxlW119IFtmaWxlc10gVGhlIGZpbGVzIHVzZWQgaW4gdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVsZXRpb25fa2V5XSBUaGUgZGVsZXRpb24ga2V5IG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T3V0cHV0fSBPdXRwdXRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdGF0dXMgVGhlIG91dHB1dCBzdGF0dXNcbiAqIEBwcm9wZXJ0eSB7UmVzdWx0fSBbcmVzdWx0XSBUaGUgcmVzdWx0IGRhdGEgb2JqZWN0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2Vycm9yXSBUaGUgZXJyb3Iga2V5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW21lc3NhZ2VdIFRoZSBlcnJvciBtZXNzYWdlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7UG9zdH0gUG9zdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmFtZSBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgcGFzdGUgKG11c3QgYmUgbGVzcyB0aGFuIDI1IEtpQilcbiAqIEBwcm9wZXJ0eSB7cHVibGljIHwgdW5saXN0ZWQgfCBwcml2YXRlfSBbdmlzaWJpbGl0eT11bmxpc3RlZF0gVGhlIHZpc2liaWxpdHkgb2YgdGhlIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2V4cGlyZXNdIFRoZSBleHBpcmF0aW9uIGRhdGUgb2YgdGhlIHBhc3RlIChtdXN0IGJlIGEgVVRDIElTTyA4NjAxIHN0cmluZylcbiAqIEBwcm9wZXJ0eSB7RmlsZU91dFtdfSBmaWxlcyBBcnJheSBvZiBmaWxlcyB0byBhZGQgdG8gdGhlIHBhc3RlIChhdCBsZWFzdCBvbmUgZmlsZSlcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtBdXRob3J9IEF1dGhvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtpZF0gVGhlIElEIG9mIHRoZSBhdXRob3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdXNlcm5hbWVdIFRoZSB1c2VybmFtZSBvZiB0aGUgYXV0aG9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBhdXRob3JcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtVcGRhdGV9IFVwZGF0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmV3IG5hbWUgb2YgdGhlIHBvc3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBUaGUgbmV3IGRlc2NyaXB0aW9uIG9mIHRoZSBwb3N0XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7RmlsZX0gRmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgbnVsbH0gaGlnaGxpZ2h0X2xhbmd1YWdlIFRoZSBzeW50YXggaGlnaGxpZ2h0aW5nIGxhbmd1YWdlIHVzZWRcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtDb250ZW50fSBDb250ZW50XG4gKiBAcHJvcGVydHkge3RleHQgfCBiYXNlNjQgfCBnemlwIHwgeHp9IGZvcm1hdCBUaGUgZm9ybWF0IG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2hpZ2hsaWdodF9sYW5ndWFnZV0gVGhlIHN5bnRheCBoaWdobGlnaHRpbmcgbGFuZ3VhZ2UgdG8gdXNlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBmaWxlIGNvbnRlbnRzXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7RmlsZU91dH0gRmlsZU91dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmFtZSBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtDb250ZW50fSBjb250ZW50IFRoZSBjb250ZW50IG9mIHRoZSBmaWxlXG4gKi9cbiJdfQ==