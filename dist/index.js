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
            body: body && method !== "GET" ? JSON.stringify(body) : null,
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
        if (!(id === null || id === void 0 ? void 0 : id.length))
            throw new Error("A paste ID is required to use PasteGG#get()");
        return this._request(interfaces_1.Methods.GET, `/pastes/${id}`, { full });
    }
    /**
     * Create a new paste.
     * @param {Post} input The information to create the paste with.
     * @returns {Promise<Output>}
     * @public
     */
    async post(input) {
        if (!input)
            throw new Error("An input object is required to use PasteGG#post()");
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
            throw new Error("An auth key or deletion key is needed to use PasteGG#delete()");
        return await this._request(interfaces_1.Methods.DELETE, `/pastes/${id}`, null, key);
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
            throw new Error("An auth key is required to use PasteGG#update()");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQStCO0FBQy9CLDZDQUFzRTtBQUN0RSw2Q0FXc0I7QUFFdEI7O0dBRUc7QUFDSCxNQUFNLE9BQU87SUFNWDs7Ozs7O09BTUc7SUFDSCxZQUNFLElBQWEsRUFDYixVQUFtQjtRQUNqQixPQUFPLEVBQUUsc0JBQXNCO1FBQy9CLE9BQU8sRUFBRSxrQkFBa0I7UUFDM0IsT0FBTyxFQUFFLENBQUM7S0FDWDtRQWxCSCx3QkFBdUI7UUFDdkIsdUJBQXNCO1FBbUJwQjs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksU0FBUyxJQUFJLEVBQUM7UUFDbEI7Ozs7O1dBS0c7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2Qjs7Ozs7V0FLRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4RDs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUM7SUFDakUsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssS0FBSyxDQUFDLFFBQVEsQ0FDcEIsTUFBNEIsRUFDNUIsSUFBWSxFQUNaLElBQWEsRUFDYixHQUFZO1FBRVosTUFBTSxPQUFPLEdBQVksRUFBRSxDQUFDO1FBQzVCO1lBQWdCLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxtQ0FBVSxFQUFFLENBQUM7UUFDNUQsSUFBSSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsTUFBTTtZQUFFLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUN0RCxJ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TyxDQUFDLENBQUMseUJBQXlCO0FBRTNEOzs7OztHQUtHO0FBRUg7Ozs7O0dBS0c7QUFFSDs7Ozs7Ozs7Ozs7OztHQWFHO0FBRUg7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7R0FPRztBQUVIOzs7OztHQUtHO0FBRUg7Ozs7R0FJRztBQUVIOzs7OztHQUtHO0FBRUg7Ozs7O0dBS0c7QUFFSDs7OztHQUlHIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCDCqSBTZXJlbk1vZHoyMSAyMDE4IC0gMjAyMSBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVW5hdXRob3JpemVkIGRpc3RyaWJ1dGlvbiBvZiBhbnkgY29kZSB3aXRoaW4gdGhpcyBwcm9qZWN0IG1heSByZXN1bHQgaW4gY29uc2VxdWVuY2VzIGNob3NlbiBieSB0aGUgQm9hcmQgTWVtYmVycy5cbiAqIFJlZmVyIHRvIHRoZSBSRUFETUUgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cblxuaW1wb3J0IGZldGNoIGZyb20gXCJub2RlLWZldGNoXCI7XG5pbXBvcnQgeyBQYXJzZWRVcmxRdWVyeUlucHV0IGFzIElucHV0LCBzdHJpbmdpZnkgfSBmcm9tIFwicXVlcnlzdHJpbmdcIjtcbmltcG9ydCB7XG4gIEF1dGhvcixcbiAgQ29udGVudCxcbiAgRmlsZSxcbiAgSUhlYWRlcixcbiAgTWV0aG9kcyxcbiAgT3B0aW9ucyxcbiAgT3V0cHV0LFxuICBQb3N0LFxuICBSZXN1bHQsXG4gIFVwZGF0ZSxcbn0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuXG4vKipcbiAqIFRoZSBtYWluIGNsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIHRoZSBQYXN0ZS5nZyBBUElcbiAqL1xuY2xhc3MgUGFzdGVHRyB7XG4gIHJlYWRvbmx5ICNhdXRoOiBzdHJpbmc7XG4gIHJlYWRvbmx5ICN1cmw6IHN0cmluZztcbiAgcmVhZG9ubHkgb3B0aW9uczogT3B0aW9ucztcbiAgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgUGFzdGVHR1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXV0aCBPcHRpb25hbCBhdXRoIGtleVxuICAgKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgKiBAY2xhc3MgUGFzdGVHR1xuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgYXV0aD86IHN0cmluZyxcbiAgICBvcHRpb25zOiBPcHRpb25zID0ge1xuICAgICAgYmFzZVVybDogXCJodHRwczovL2FwaS5wYXN0ZS5nZ1wiLFxuICAgICAgbWFpblVybDogXCJodHRwczovL3Bhc3RlLmdnXCIsXG4gICAgICB2ZXJzaW9uOiAxLFxuICAgIH1cbiAgKSB7XG4gICAgLyoqXG4gICAgICogVGhlIGF1dGgga2V5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuI2F1dGggPSBhdXRoO1xuICAgIC8qKlxuICAgICAqIFRoZSBvcHRpb25zIGZvciB0aGUgcGFzdGUgc2VydmVyXG4gICAgICogQHR5cGUge09wdGlvbnN9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgLyoqXG4gICAgICogVGhlIHZlcnNpb24gb2YgdGhlIEFQSSB3cmFwcGVyXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy52ZXJzaW9uID0gYHYke3JlcXVpcmUoXCIuLi9wYWNrYWdlLmpzb25cIikudmVyc2lvbn1gO1xuICAgIC8qKlxuICAgICAqIFRoZSBmdWxsIFVSTCBmb3IgdGhlIEFQSVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLiN1cmwgPSBgJHt0aGlzLm9wdGlvbnMuYmFzZVVybH0vdiR7dGhpcy5vcHRpb25zLnZlcnNpb259YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGEgcmVxdWVzdCB0byB0aGUgQVBJLlxuICAgKiBAcGFyYW0ge2tleW9mIHR5cGVvZiBNZXRob2RzfSBtZXRob2RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtvYmplY3R9IGJvZHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgX3JlcXVlc3Q8VD4oXG4gICAgbWV0aG9kOiBrZXlvZiB0eXBlb2YgTWV0aG9kcyxcbiAgICBwYXRoOiBzdHJpbmcsXG4gICAgYm9keT86IG9iamVjdCxcbiAgICBrZXk/OiBzdHJpbmdcbiAgKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgaGVhZGVyczogSUhlYWRlciA9IHt9O1xuICAgIGlmICh0aGlzLiNhdXRoKSBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgS2V5ICR7dGhpcy4jYXV0aH1gO1xuICAgIGlmIChrZXk/Lmxlbmd0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke2tleX1gO1xuICAgIGlmIChtZXRob2QgIT09IFwiR0VUXCIpIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcblxuICAgIGxldCB1cmxQYXRoID0gYCR7dGhpcy4jdXJsfSR7cGF0aH1gO1xuICAgIGlmIChib2R5ICYmIG1ldGhvZCA9PT0gXCJHRVRcIikgdXJsUGF0aCArPSBgPyR7c3RyaW5naWZ5KDxJbnB1dD5ib2R5KX1gO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmxQYXRoLCB7XG4gICAgICBtZXRob2QsXG4gICAgICBoZWFkZXJzLFxuICAgICAgYm9keTogYm9keSAmJiBtZXRob2QgIT09IFwiR0VUXCIgPyBKU09OLnN0cmluZ2lmeShib2R5KSA6IG51bGwsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgcGFzdGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZnVsbCBJbmNsdWRlcyB0aGUgY29udGVudHMgb2YgZmlsZXMgaWYgdHJ1ZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0Pn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIGdldChpZDogc3RyaW5nLCBmdWxsOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPE91dHB1dD4ge1xuICAgIGlmICghaWQ/Lmxlbmd0aClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgcGFzdGUgSUQgaXMgcmVxdWlyZWQgdG8gdXNlIFBhc3RlR0cjZ2V0KClcIik7XG5cbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdDxPdXRwdXQ+KE1ldGhvZHMuR0VULCBgL3Bhc3Rlcy8ke2lkfWAsIHsgZnVsbCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgcGFzdGUuXG4gICAqIEBwYXJhbSB7UG9zdH0gaW5wdXQgVGhlIGluZm9ybWF0aW9uIHRvIGNyZWF0ZSB0aGUgcGFzdGUgd2l0aC5cbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0Pn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHBvc3QoaW5wdXQ6IFBvc3QpOiBQcm9taXNlPE91dHB1dD4ge1xuICAgIGlmICghaW5wdXQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbiBpbnB1dCBvYmplY3QgaXMgcmVxdWlyZWQgdG8gdXNlIFBhc3RlR0cjcG9zdCgpXCIpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy5fcmVxdWVzdDxPdXRwdXQ+KE1ldGhvZHMuUE9TVCwgXCIvcGFzdGVzXCIsIGlucHV0KTtcbiAgICBpZiAocmVzLnJlc3VsdCkgcmVzLnJlc3VsdC51cmwgPSBgJHt0aGlzLm9wdGlvbnMubWFpblVybH0vJHtyZXMucmVzdWx0LmlkfWA7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZSB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBBdXRoIGtleSBvciBkZWxldGlvbiBrZXkgKGxlYXZlIGJsYW5rIGlmIHlvdSBoYXZlIHNldCB0aGUgYXV0aCBrZXkgaW4gdGhlIGNvbnN0cnVjdG9yKVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQgfCB2b2lkPn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIGRlbGV0ZShpZDogc3RyaW5nLCBrZXk/OiBzdHJpbmcpOiBQcm9taXNlPE91dHB1dCB8IHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuI2F1dGg/Lmxlbmd0aCAmJiAha2V5Py5sZW5ndGgpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiQW4gYXV0aCBrZXkgb3IgZGVsZXRpb24ga2V5IGlzIG5lZWRlZCB0byB1c2UgUGFzdGVHRyNkZWxldGUoKVwiXG4gICAgICApO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihcbiAgICAgIE1ldGhvZHMuREVMRVRFLFxuICAgICAgYC9wYXN0ZXMvJHtpZH1gLFxuICAgICAgbnVsbCxcbiAgICAgIGtleVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIGZvciB0aGUgcGFzdGUgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge1VwZGF0ZX0gb3B0aW9ucyBUaGUgb3B0aW9ucyB5b3Ugd2lzaCB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE91dHB1dCB8IHZvaWQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgdXBkYXRlKGlkOiBzdHJpbmcsIG9wdGlvbnM6IFVwZGF0ZSk6IFByb21pc2U8T3V0cHV0IHwgdm9pZD4ge1xuICAgIGlmICghdGhpcy4jYXV0aD8ubGVuZ3RoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gYXV0aCBrZXkgaXMgcmVxdWlyZWQgdG8gdXNlIFBhc3RlR0cjdXBkYXRlKClcIik7XG5cbiAgICBpZiAoIW9wdGlvbnMubmFtZSkgb3B0aW9ucy5uYW1lID0gbnVsbDtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdDxPdXRwdXQ+KE1ldGhvZHMuUEFUQ0gsIGAvcGFzdGVzLyR7aWR9YCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0IHsgUGFzdGVHRyB9O1xuZXhwb3J0IGRlZmF1bHQgUGFzdGVHRztcbm1vZHVsZS5leHBvcnRzID0gUGFzdGVHRzsgLy8gSlM6IGRlZmF1bHQgaW1wb3J0XG5tb2R1bGUuZXhwb3J0cy5QYXN0ZUdHID0gUGFzdGVHRzsgLy8gSlM6IGRlY29uc3RydWN0IGltcG9ydFxuXG4vKipcbiAqIFRoZSBoZWFkZXIgb3B0aW9uc1xuICogQHR5cGVkZWYge0lIZWFkZXJ9IElIZWFkZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbQ29udGVudC1UeXBlXSBUaGUgcmVxdWVzdCBjb250ZW50IHR5cGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbQXV0aG9yaXphdGlvbl0gQXV0aG9yaXphdGlvbiBmb3IgdGhlIHJlcXVlc3RcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPcHRpb25zfSBPcHRpb25zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmFzZVVybCBUaGUgYmFzZSBVUkwgb2YgdGhlIEFQSVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1haW5VcmwgVGhlIFVSTCBvZiB0aGUgbWFpbiB3ZWJzaXRlXG4gKiBAcHJvcGVydHkge251bWJlcn0gdmVyc2lvbiBUaGUgdmVyc2lvbiBvZiB0aGUgQVBJXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7UmVzdWx0fSBSZXN1bHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdXJsXSBUaGUgVVJMIGZvciB0aGUgcmVzdWx0XG4gKiBAcHJvcGVydHkge0F1dGhvcn0gW2F1dGhvcl0gVGhlIGF1dGhvciBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNyZWF0ZWRfYXQgVGhlIGRhdGUgdGhlIHBhc3RlIHdhcyBjcmVhdGVkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdXBkYXRlZF9hdCBUaGUgZGF0ZSB0aGUgcGFzdGUgd2FzIGxhc3QgdXBkYXRlZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtleHBpcmVzXSBUaGUgZGF0ZSB3aGVuIHRoZSBwYXN0ZSBleHBpcmVzXG4gKiBAcHJvcGVydHkge0ZpbGVbXX0gW2ZpbGVzXSBUaGUgZmlsZXMgdXNlZCBpbiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZWxldGlvbl9rZXldIFRoZSBkZWxldGlvbiBrZXkgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPdXRwdXR9IE91dHB1dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHN0YXR1cyBUaGUgb3V0cHV0IHN0YXR1c1xuICogQHByb3BlcnR5IHtSZXN1bHR9IFtyZXN1bHRdIFRoZSByZXN1bHQgZGF0YSBvYmplY3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXJyb3JdIFRoZSBlcnJvciBrZXlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbWVzc2FnZV0gVGhlIGVycm9yIG1lc3NhZ2VcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtQb3N0fSBQb3N0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBwYXN0ZSAobXVzdCBiZSBsZXNzIHRoYW4gMjUgS2lCKVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXhwaXJlc10gVGhlIGV4cGlyYXRpb24gZGF0ZSBvZiB0aGUgcGFzdGUgKG11c3QgYmUgYSBVVEMgSVNPIDg2MDEgc3RyaW5nKVxuICogQHByb3BlcnR5IHtGaWxlT3V0W119IGZpbGVzIEFycmF5IG9mIGZpbGVzIHRvIGFkZCB0byB0aGUgcGFzdGUgKGF0IGxlYXN0IG9uZSBmaWxlKVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0F1dGhvcn0gQXV0aG9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2lkXSBUaGUgSUQgb2YgdGhlIGF1dGhvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt1c2VybmFtZV0gVGhlIHVzZXJuYW1lIG9mIHRoZSBhdXRob3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGF1dGhvclxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1VwZGF0ZX0gVXBkYXRlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuZXcgbmFtZSBvZiB0aGUgcG9zdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc2NyaXB0aW9uIFRoZSBuZXcgZGVzY3JpcHRpb24gb2YgdGhlIHBvc3RcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtGaWxlfSBGaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmcgfCBudWxsfSBoaWdobGlnaHRfbGFuZ3VhZ2UgVGhlIHN5bnRheCBoaWdobGlnaHRpbmcgbGFuZ3VhZ2UgdXNlZFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0NvbnRlbnR9IENvbnRlbnRcbiAqIEBwcm9wZXJ0eSB7dGV4dCB8IGJhc2U2NCB8IGd6aXAgfCB4en0gZm9ybWF0IFRoZSBmb3JtYXQgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaGlnaGxpZ2h0X2xhbmd1YWdlXSBUaGUgc3ludGF4IGhpZ2hsaWdodGluZyBsYW5ndWFnZSB0byB1c2VcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGZpbGUgY29udGVudHNcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtGaWxlT3V0fSBGaWxlT3V0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge0NvbnRlbnR9IGNvbnRlbnQgVGhlIGNvbnRlbnQgb2YgdGhlIGZpbGVcbiAqL1xuIl19