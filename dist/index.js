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
const petitio_1 = __importDefault(require("petitio"));
const querystring_1 = require("querystring");
const interfaces_1 = require("./interfaces");
const defaultOptions = {
    baseUrl: "https://api.paste.gg",
    mainUrl: "https://paste.gg",
    version: 1,
};
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
    constructor(auth, options = defaultOptions) {
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
        this.options = Object.assign(defaultOptions, options);
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
        return petitio_1.default(urlPath, method).header(headers).body(body).json();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0RBQTBCO0FBQzFCLDZDQUFzRTtBQUN0RSw2Q0FXc0I7QUFFdEIsTUFBTSxjQUFjLEdBQVk7SUFDOUIsT0FBTyxFQUFFLHNCQUFzQjtJQUMvQixPQUFPLEVBQUUsa0JBQWtCO0lBQzNCLE9BQU8sRUFBRSxDQUFDO0NBQ1gsQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFBTSxPQUFPO0lBTVg7Ozs7OztPQU1HO0lBQ0gsWUFBbUIsSUFBYSxFQUFFLFVBQW1CLGNBQWM7UUFabkUsd0JBQXVCO1FBQ3ZCLHVCQUFzQjtRQVlwQjs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksU0FBUyxJQUFJLEVBQUM7UUFDbEI7Ozs7O1dBS0c7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQW1CLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4RTs7Ozs7V0FLRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4RDs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUM7SUFDakUsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssS0FBSyxDQUFDLFFBQVEsQ0FDcEIsTUFBNEIsRUFDNUIsSUFBWSxFQUNaLElBQWEsRUFDYixHQUFZO1FBRVosTUFBTSxPQUFPLEdBQVksRUFBRSxDQUFDO1FBQzVCO1lBQWdCLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxtQ0FBVSxFQUFFLENBQUM7UUFDNUQsSUFBSSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxH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Ozs7O0dBTUc7QUFFSDs7Ozs7OztHQU9HO0FBRUg7Ozs7O0dBS0c7QUFFSDs7OztHQUlHO0FBRUg7Ozs7O0dBS0c7QUFFSDs7Ozs7R0FLRztBQUVIOzs7O0dBSUciLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IMKpIFNlcmVuTW9kejIxIDIwMTggLSAyMDIxIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBVbmF1dGhvcml6ZWQgZGlzdHJpYnV0aW9uIG9mIGFueSBjb2RlIHdpdGhpbiB0aGlzIHByb2plY3QgbWF5IHJlc3VsdCBpbiBjb25zZXF1ZW5jZXMgY2hvc2VuIGJ5IHRoZSBCb2FyZCBNZW1iZXJzLlxuICogUmVmZXIgdG8gdGhlIFJFQURNRSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuXG5pbXBvcnQgcmVxIGZyb20gXCJwZXRpdGlvXCI7XG5pbXBvcnQgeyBQYXJzZWRVcmxRdWVyeUlucHV0IGFzIElucHV0LCBzdHJpbmdpZnkgfSBmcm9tIFwicXVlcnlzdHJpbmdcIjtcbmltcG9ydCB7XG4gIEF1dGhvcixcbiAgQ29udGVudCxcbiAgRmlsZSxcbiAgSUhlYWRlcixcbiAgTWV0aG9kcyxcbiAgT3B0aW9ucyxcbiAgT3V0cHV0LFxuICBQb3N0LFxuICBSZXN1bHQsXG4gIFVwZGF0ZSxcbn0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IDxPcHRpb25zPntcbiAgYmFzZVVybDogXCJodHRwczovL2FwaS5wYXN0ZS5nZ1wiLFxuICBtYWluVXJsOiBcImh0dHBzOi8vcGFzdGUuZ2dcIixcbiAgdmVyc2lvbjogMSxcbn07XG5cbi8qKlxuICogVGhlIG1haW4gY2xhc3MgZm9yIGludGVyYWN0aW5nIHdpdGggdGhlIFBhc3RlLmdnIEFQSVxuICovXG5jbGFzcyBQYXN0ZUdHIHtcbiAgcmVhZG9ubHkgI2F1dGg6IHN0cmluZztcbiAgcmVhZG9ubHkgI3VybDogc3RyaW5nO1xuICByZWFkb25seSBvcHRpb25zOiBPcHRpb25zO1xuICByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBQYXN0ZUdHXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoIE9wdGlvbmFsIGF1dGgga2V5XG4gICAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgcGFzdGUgc2VydmVyXG4gICAqIEBjbGFzcyBQYXN0ZUdHXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihhdXRoPzogc3RyaW5nLCBvcHRpb25zOiBPcHRpb25zID0gZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAvKipcbiAgICAgKiBUaGUgYXV0aCBrZXlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy4jYXV0aCA9IGF1dGg7XG4gICAgLyoqXG4gICAgICogVGhlIG9wdGlvbnMgZm9yIHRoZSBwYXN0ZSBzZXJ2ZXJcbiAgICAgKiBAdHlwZSB7T3B0aW9uc31cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbjxPcHRpb25zLCBPcHRpb25zPihkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgLyoqXG4gICAgICogVGhlIHZlcnNpb24gb2YgdGhlIEFQSSB3cmFwcGVyXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy52ZXJzaW9uID0gYHYke3JlcXVpcmUoXCIuLi9wYWNrYWdlLmpzb25cIikudmVyc2lvbn1gO1xuICAgIC8qKlxuICAgICAqIFRoZSBmdWxsIFVSTCBmb3IgdGhlIEFQSVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLiN1cmwgPSBgJHt0aGlzLm9wdGlvbnMuYmFzZVVybH0vdiR7dGhpcy5vcHRpb25zLnZlcnNpb259YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGEgcmVxdWVzdCB0byB0aGUgQVBJLlxuICAgKiBAcGFyYW0ge2tleW9mIHR5cGVvZiBNZXRob2RzfSBtZXRob2RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICogQHBhcmFtIHtvYmplY3R9IGJvZHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxUPn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgX3JlcXVlc3Q8VD4oXG4gICAgbWV0aG9kOiBrZXlvZiB0eXBlb2YgTWV0aG9kcyxcbiAgICBwYXRoOiBzdHJpbmcsXG4gICAgYm9keT86IG9iamVjdCxcbiAgICBrZXk/OiBzdHJpbmdcbiAgKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgaGVhZGVyczogSUhlYWRlciA9IHt9O1xuICAgIGlmICh0aGlzLiNhdXRoKSBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgS2V5ICR7dGhpcy4jYXV0aH1gO1xuICAgIGlmIChrZXk/Lmxlbmd0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke2tleX1gO1xuICAgIGlmIChtZXRob2QgIT09IFwiR0VUXCIpIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcblxuICAgIGxldCB1cmxQYXRoID0gYCR7dGhpcy4jdXJsfSR7cGF0aH1gO1xuICAgIGlmIChib2R5ICYmIG1ldGhvZCA9PT0gXCJHRVRcIikgdXJsUGF0aCArPSBgPyR7c3RyaW5naWZ5KDxJbnB1dD5ib2R5KX1gO1xuXG4gICAgcmV0dXJuIHJlcSh1cmxQYXRoLCBtZXRob2QpLmhlYWRlcihoZWFkZXJzKS5ib2R5KGJvZHkpLmpzb248VD4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIHBhc3RlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZ1bGwgSW5jbHVkZXMgdGhlIGNvbnRlbnRzIG9mIGZpbGVzIGlmIHRydWUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE91dHB1dD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBnZXQoaWQ6IHN0cmluZywgZnVsbDogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxPdXRwdXQ+IHtcbiAgICBpZiAoIWlkPy5sZW5ndGgpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHBhc3RlIElEIGlzIHJlcXVpcmVkIHRvIHVzZSBQYXN0ZUdHI2dldCgpXCIpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLkdFVCwgYC9wYXN0ZXMvJHtpZH1gLCB7IGZ1bGwgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHBhc3RlLlxuICAgKiBAcGFyYW0ge1Bvc3R9IGlucHV0IFRoZSBpbmZvcm1hdGlvbiB0byBjcmVhdGUgdGhlIHBhc3RlIHdpdGguXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE91dHB1dD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBwb3N0KGlucHV0OiBQb3N0KTogUHJvbWlzZTxPdXRwdXQ+IHtcbiAgICBpZiAoIWlucHV0KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gaW5wdXQgb2JqZWN0IGlzIHJlcXVpcmVkIHRvIHVzZSBQYXN0ZUdHI3Bvc3QoKVwiKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLlBPU1QsIFwiL3Bhc3Rlc1wiLCBpbnB1dCk7XG4gICAgaWYgKHJlcy5yZXN1bHQpIHJlcy5yZXN1bHQudXJsID0gYCR7dGhpcy5vcHRpb25zLm1haW5Vcmx9LyR7cmVzLnJlc3VsdC5pZH1gO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgcGFzdGUgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gQXV0aCBrZXkgb3IgZGVsZXRpb24ga2V5IChsZWF2ZSBibGFuayBpZiB5b3UgaGF2ZSBzZXQgdGhlIGF1dGgga2V5IGluIHRoZSBjb25zdHJ1Y3RvcilcbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0IHwgdm9pZD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBkZWxldGUoaWQ6IHN0cmluZywga2V5Pzogc3RyaW5nKTogUHJvbWlzZTxPdXRwdXQgfCB2b2lkPiB7XG4gICAgaWYgKCF0aGlzLiNhdXRoPy5sZW5ndGggJiYgIWtleT8ubGVuZ3RoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIkFuIGF1dGgga2V5IG9yIGRlbGV0aW9uIGtleSBpcyBuZWVkZWQgdG8gdXNlIFBhc3RlR0cjZGVsZXRlKClcIlxuICAgICAgKTtcblxuICAgIHJldHVybiBhd2FpdCB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oXG4gICAgICBNZXRob2RzLkRFTEVURSxcbiAgICAgIGAvcGFzdGVzLyR7aWR9YCxcbiAgICAgIG51bGwsXG4gICAgICBrZXlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBmb3IgdGhlIHBhc3RlIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtVcGRhdGV9IG9wdGlvbnMgVGhlIG9wdGlvbnMgeW91IHdpc2ggdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQgfCB2b2lkPn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHVwZGF0ZShpZDogc3RyaW5nLCBvcHRpb25zOiBVcGRhdGUpOiBQcm9taXNlPE91dHB1dCB8IHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuI2F1dGg/Lmxlbmd0aClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGF1dGgga2V5IGlzIHJlcXVpcmVkIHRvIHVzZSBQYXN0ZUdHI3VwZGF0ZSgpXCIpO1xuXG4gICAgaWYgKCFvcHRpb25zLm5hbWUpIG9wdGlvbnMubmFtZSA9IG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLlBBVENILCBgL3Bhc3Rlcy8ke2lkfWAsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCB7IFBhc3RlR0cgfTtcbmV4cG9ydCBkZWZhdWx0IFBhc3RlR0c7XG5tb2R1bGUuZXhwb3J0cyA9IFBhc3RlR0c7IC8vIEpTOiBkZWZhdWx0IGltcG9ydFxubW9kdWxlLmV4cG9ydHMuUGFzdGVHRyA9IFBhc3RlR0c7IC8vIEpTOiBkZWNvbnN0cnVjdCBpbXBvcnRcblxuLyoqXG4gKiBUaGUgaGVhZGVyIG9wdGlvbnNcbiAqIEB0eXBlZGVmIHtJSGVhZGVyfSBJSGVhZGVyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW0NvbnRlbnQtVHlwZV0gVGhlIHJlcXVlc3QgY29udGVudCB0eXBlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW0F1dGhvcml6YXRpb25dIEF1dGhvcml6YXRpb24gZm9yIHRoZSByZXF1ZXN0XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T3B0aW9uc30gT3B0aW9uc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGJhc2VVcmwgVGhlIGJhc2UgVVJMIG9mIHRoZSBBUElcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBtYWluVXJsIFRoZSBVUkwgb2YgdGhlIG1haW4gd2Vic2l0ZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHZlcnNpb24gVGhlIHZlcnNpb24gb2YgdGhlIEFQSVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1Jlc3VsdH0gUmVzdWx0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3VybF0gVGhlIFVSTCBmb3IgdGhlIHJlc3VsdFxuICogQHByb3BlcnR5IHtBdXRob3J9IFthdXRob3JdIFRoZSBhdXRob3Igb2YgdGhlIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7cHVibGljIHwgdW5saXN0ZWQgfCBwcml2YXRlfSBbdmlzaWJpbGl0eT11bmxpc3RlZF0gVGhlIHZpc2liaWxpdHkgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjcmVhdGVkX2F0IFRoZSBkYXRlIHRoZSBwYXN0ZSB3YXMgY3JlYXRlZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHVwZGF0ZWRfYXQgVGhlIGRhdGUgdGhlIHBhc3RlIHdhcyBsYXN0IHVwZGF0ZWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXhwaXJlc10gVGhlIGRhdGUgd2hlbiB0aGUgcGFzdGUgZXhwaXJlc1xuICogQHByb3BlcnR5IHtGaWxlW119IFtmaWxlc10gVGhlIGZpbGVzIHVzZWQgaW4gdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVsZXRpb25fa2V5XSBUaGUgZGVsZXRpb24ga2V5IG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T3V0cHV0fSBPdXRwdXRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdGF0dXMgVGhlIG91dHB1dCBzdGF0dXNcbiAqIEBwcm9wZXJ0eSB7UmVzdWx0fSBbcmVzdWx0XSBUaGUgcmVzdWx0IGRhdGEgb2JqZWN0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2Vycm9yXSBUaGUgZXJyb3Iga2V5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW21lc3NhZ2VdIFRoZSBlcnJvciBtZXNzYWdlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7UG9zdH0gUG9zdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmFtZSBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgcGFzdGUgKG11c3QgYmUgbGVzcyB0aGFuIDI1IEtpQilcbiAqIEBwcm9wZXJ0eSB7cHVibGljIHwgdW5saXN0ZWQgfCBwcml2YXRlfSBbdmlzaWJpbGl0eT11bmxpc3RlZF0gVGhlIHZpc2liaWxpdHkgb2YgdGhlIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2V4cGlyZXNdIFRoZSBleHBpcmF0aW9uIGRhdGUgb2YgdGhlIHBhc3RlIChtdXN0IGJlIGEgVVRDIElTTyA4NjAxIHN0cmluZylcbiAqIEBwcm9wZXJ0eSB7RmlsZU91dFtdfSBmaWxlcyBBcnJheSBvZiBmaWxlcyB0byBhZGQgdG8gdGhlIHBhc3RlIChhdCBsZWFzdCBvbmUgZmlsZSlcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtBdXRob3J9IEF1dGhvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtpZF0gVGhlIElEIG9mIHRoZSBhdXRob3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdXNlcm5hbWVdIFRoZSB1c2VybmFtZSBvZiB0aGUgYXV0aG9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBhdXRob3JcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtVcGRhdGV9IFVwZGF0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmV3IG5hbWUgb2YgdGhlIHBvc3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBUaGUgbmV3IGRlc2NyaXB0aW9uIG9mIHRoZSBwb3N0XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7RmlsZX0gRmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nIHwgbnVsbH0gaGlnaGxpZ2h0X2xhbmd1YWdlIFRoZSBzeW50YXggaGlnaGxpZ2h0aW5nIGxhbmd1YWdlIHVzZWRcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtDb250ZW50fSBDb250ZW50XG4gKiBAcHJvcGVydHkge3RleHQgfCBiYXNlNjQgfCBnemlwIHwgeHp9IGZvcm1hdCBUaGUgZm9ybWF0IG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2hpZ2hsaWdodF9sYW5ndWFnZV0gVGhlIHN5bnRheCBoaWdobGlnaHRpbmcgbGFuZ3VhZ2UgdG8gdXNlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdmFsdWUgVGhlIHZhbHVlIG9mIHRoZSBmaWxlIGNvbnRlbnRzXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7RmlsZU91dH0gRmlsZU91dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmFtZSBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtDb250ZW50fSBjb250ZW50IFRoZSBjb250ZW50IG9mIHRoZSBmaWxlXG4gKi9cbiJdfQ==