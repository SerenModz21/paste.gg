"use strict";
/*
 * Copyright © SerenModz21 2018 - 2021 All Rights Reserved.
 * Unauthorized distribution of any code within this project may result in consequences chosen by the Board Members.
 * Refer to the README for more information.
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _PasteGG_auth, _PasteGG_url;
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
        _PasteGG_auth.set(this, void 0);
        _PasteGG_url.set(this, void 0);
        /**
         * The auth key
         * @type {string}
         * @private
         * @readonly
         */
        __classPrivateFieldSet(this, _PasteGG_auth, auth, "f");
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
        __classPrivateFieldSet(this, _PasteGG_url, `${this.options.baseUrl}/v${this.options.version}`, "f");
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
        if (__classPrivateFieldGet(this, _PasteGG_auth, "f"))
            headers.Authorization = `Key ${__classPrivateFieldGet(this, _PasteGG_auth, "f")}`;
        if (key === null || key === void 0 ? void 0 : key.length)
            headers.Authorization = `Key ${key}`;
        if (method !== "GET")
            headers["Content-Type"] = "application/json";
        let urlPath = `${__classPrivateFieldGet(this, _PasteGG_url, "f")}${path}`;
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
        if (!((_a = __classPrivateFieldGet(this, _PasteGG_auth, "f")) === null || _a === void 0 ? void 0 : _a.length) && !(key === null || key === void 0 ? void 0 : key.length))
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
        if (!((_a = __classPrivateFieldGet(this, _PasteGG_auth, "f")) === null || _a === void 0 ? void 0 : _a.length))
            throw new Error("An auth key is required to use PasteGG#update()");
        if (!options.name)
            options.name = null;
        return this._request(interfaces_1.Methods.PATCH, `/pastes/${id}`, options);
    }
}
exports.PasteGG = PasteGG;
_PasteGG_auth = new WeakMap(), _PasteGG_url = new WeakMap();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNEQUEwQjtBQUMxQiw2Q0FBc0U7QUFDdEUsNkNBV3NCO0FBRXRCLE1BQU0sY0FBYyxHQUFZO0lBQzlCLE9BQU8sRUFBRSxzQkFBc0I7SUFDL0IsT0FBTyxFQUFFLGtCQUFrQjtJQUMzQixPQUFPLEVBQUUsQ0FBQztDQUNYLENBQUM7QUFFRjs7R0FFRztBQUNILE1BQU0sT0FBTztJQU1YOzs7Ozs7T0FNRztJQUNILFlBQW1CLElBQWEsRUFBRSxVQUFtQixjQUFjO1FBWm5FLGdDQUF1QjtRQUN2QiwrQkFBc0I7UUFZcEI7Ozs7O1dBS0c7UUFDSCx1QkFBQSxJQUFJLGlCQUFTLElBQUksTUFBQSxDQUFDO1FBQ2xCOzs7OztXQUtHO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFtQixjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEU7Ozs7O1dBS0c7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEQ7Ozs7O1dBS0c7UUFDSCx1QkFBQSxJQUFJLGdCQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBQSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLEtBQUssQ0FBQyxRQUFRLENBQ3BCLE1BQTRCLEVBQzVCLElBQVksRUFDWixJQUFhLEVBQ2IsR0FBWTtRQUVaLE1BQU0sT0FBTyxHQUFZLEVBQUUsQ0FBQztRQUM1QixJQUFJLHVCQUFBLElBQUkscUJBQU07WUFBRSxPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sdUJBQUEsSUFBSSxxQkFBTSxF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Q0FBQyxxQkFBcUI7QUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMseUJBQXlCO0FBRTNEOzs7OztHQUtHO0FBRUg7Ozs7O0dBS0c7QUFFSDs7Ozs7Ozs7Ozs7OztHQWFHO0FBRUg7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7R0FPRztBQUVIOzs7OztHQUtHO0FBRUg7Ozs7R0FJRztBQUVIOzs7OztHQUtHO0FBRUg7Ozs7O0dBS0c7QUFFSDs7OztHQUlHIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCDCqSBTZXJlbk1vZHoyMSAyMDE4IC0gMjAyMSBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVW5hdXRob3JpemVkIGRpc3RyaWJ1dGlvbiBvZiBhbnkgY29kZSB3aXRoaW4gdGhpcyBwcm9qZWN0IG1heSByZXN1bHQgaW4gY29uc2VxdWVuY2VzIGNob3NlbiBieSB0aGUgQm9hcmQgTWVtYmVycy5cbiAqIFJlZmVyIHRvIHRoZSBSRUFETUUgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cblxuaW1wb3J0IHJlcSBmcm9tIFwicGV0aXRpb1wiO1xuaW1wb3J0IHsgUGFyc2VkVXJsUXVlcnlJbnB1dCBhcyBJbnB1dCwgc3RyaW5naWZ5IH0gZnJvbSBcInF1ZXJ5c3RyaW5nXCI7XG5pbXBvcnQge1xuICBBdXRob3IsXG4gIENvbnRlbnQsXG4gIEZpbGUsXG4gIElIZWFkZXIsXG4gIE1ldGhvZHMsXG4gIE9wdGlvbnMsXG4gIE91dHB1dCxcbiAgUG9zdCxcbiAgUmVzdWx0LFxuICBVcGRhdGUsXG59IGZyb20gXCIuL2ludGVyZmFjZXNcIjtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSA8T3B0aW9ucz57XG4gIGJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkucGFzdGUuZ2dcIixcbiAgbWFpblVybDogXCJodHRwczovL3Bhc3RlLmdnXCIsXG4gIHZlcnNpb246IDEsXG59O1xuXG4vKipcbiAqIFRoZSBtYWluIGNsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIHRoZSBQYXN0ZS5nZyBBUElcbiAqL1xuY2xhc3MgUGFzdGVHRyB7XG4gIHJlYWRvbmx5ICNhdXRoOiBzdHJpbmc7XG4gIHJlYWRvbmx5ICN1cmw6IHN0cmluZztcbiAgcmVhZG9ubHkgb3B0aW9uczogT3B0aW9ucztcbiAgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgUGFzdGVHR1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXV0aCBPcHRpb25hbCBhdXRoIGtleVxuICAgKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgKiBAY2xhc3MgUGFzdGVHR1xuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoYXV0aD86IHN0cmluZywgb3B0aW9uczogT3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zKSB7XG4gICAgLyoqXG4gICAgICogVGhlIGF1dGgga2V5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuI2F1dGggPSBhdXRoO1xuICAgIC8qKlxuICAgICAqIFRoZSBvcHRpb25zIGZvciB0aGUgcGFzdGUgc2VydmVyXG4gICAgICogQHR5cGUge09wdGlvbnN9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ248T3B0aW9ucywgT3B0aW9ucz4oZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBBUEkgd3JhcHBlclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMudmVyc2lvbiA9IGB2JHtyZXF1aXJlKFwiLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259YDtcbiAgICAvKipcbiAgICAgKiBUaGUgZnVsbCBVUkwgZm9yIHRoZSBBUElcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy4jdXJsID0gYCR7dGhpcy5vcHRpb25zLmJhc2VVcmx9L3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufWA7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhIHJlcXVlc3QgdG8gdGhlIEFQSS5cbiAgICogQHBhcmFtIHtrZXlvZiB0eXBlb2YgTWV0aG9kc30gbWV0aG9kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBib2R5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHJldHVybnMge1Byb21pc2U8VD59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9yZXF1ZXN0PFQ+KFxuICAgIG1ldGhvZDoga2V5b2YgdHlwZW9mIE1ldGhvZHMsXG4gICAgcGF0aDogc3RyaW5nLFxuICAgIGJvZHk/OiBvYmplY3QsXG4gICAga2V5Pzogc3RyaW5nXG4gICk6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IGhlYWRlcnM6IElIZWFkZXIgPSB7fTtcbiAgICBpZiAodGhpcy4jYXV0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke3RoaXMuI2F1dGh9YDtcbiAgICBpZiAoa2V5Py5sZW5ndGgpIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBLZXkgJHtrZXl9YDtcbiAgICBpZiAobWV0aG9kICE9PSBcIkdFVFwiKSBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XG5cbiAgICBsZXQgdXJsUGF0aCA9IGAke3RoaXMuI3VybH0ke3BhdGh9YDtcbiAgICBpZiAoYm9keSAmJiBtZXRob2QgPT09IFwiR0VUXCIpIHVybFBhdGggKz0gYD8ke3N0cmluZ2lmeSg8SW5wdXQ+Ym9keSl9YDtcblxuICAgIHJldHVybiByZXEodXJsUGF0aCwgbWV0aG9kKS5oZWFkZXIoaGVhZGVycykuYm9keShib2R5KS5qc29uPFQ+KCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBmdWxsIEluY2x1ZGVzIHRoZSBjb250ZW50cyBvZiBmaWxlcyBpZiB0cnVlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZ2V0KGlkOiBzdHJpbmcsIGZ1bGw6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8T3V0cHV0PiB7XG4gICAgaWYgKCFpZD8ubGVuZ3RoKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQSBwYXN0ZSBJRCBpcyByZXF1aXJlZCB0byB1c2UgUGFzdGVHRyNnZXQoKVwiKTtcblxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5HRVQsIGAvcGFzdGVzLyR7aWR9YCwgeyBmdWxsIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBwYXN0ZS5cbiAgICogQHBhcmFtIHtQb3N0fSBpbnB1dCBUaGUgaW5mb3JtYXRpb24gdG8gY3JlYXRlIHRoZSBwYXN0ZSB3aXRoLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcG9zdChpbnB1dDogUG9zdCk6IFByb21pc2U8T3V0cHV0PiB7XG4gICAgaWYgKCFpbnB1dClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGlucHV0IG9iamVjdCBpcyByZXF1aXJlZCB0byB1c2UgUGFzdGVHRyNwb3N0KClcIik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5QT1NULCBcIi9wYXN0ZXNcIiwgaW5wdXQpO1xuICAgIGlmIChyZXMucmVzdWx0KSByZXMucmVzdWx0LnVybCA9IGAke3RoaXMub3B0aW9ucy5tYWluVXJsfS8ke3Jlcy5yZXN1bHQuaWR9YDtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIHBhc3RlIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIEF1dGgga2V5IG9yIGRlbGV0aW9uIGtleSAobGVhdmUgYmxhbmsgaWYgeW91IGhhdmUgc2V0IHRoZSBhdXRoIGtleSBpbiB0aGUgY29uc3RydWN0b3IpXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE91dHB1dCB8IHZvaWQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGVsZXRlKGlkOiBzdHJpbmcsIGtleT86IHN0cmluZyk6IFByb21pc2U8T3V0cHV0IHwgdm9pZD4ge1xuICAgIGlmICghdGhpcy4jYXV0aD8ubGVuZ3RoICYmICFrZXk/Lmxlbmd0aClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJBbiBhdXRoIGtleSBvciBkZWxldGlvbiBrZXkgaXMgbmVlZGVkIHRvIHVzZSBQYXN0ZUdHI2RlbGV0ZSgpXCJcbiAgICAgICk7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5fcmVxdWVzdDxPdXRwdXQ+KFxuICAgICAgTWV0aG9kcy5ERUxFVEUsXG4gICAgICBgL3Bhc3Rlcy8ke2lkfWAsXG4gICAgICBudWxsLFxuICAgICAga2V5XG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgZm9yIHRoZSBwYXN0ZSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7VXBkYXRlfSBvcHRpb25zIFRoZSBvcHRpb25zIHlvdSB3aXNoIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0IHwgdm9pZD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyB1cGRhdGUoaWQ6IHN0cmluZywgb3B0aW9uczogVXBkYXRlKTogUHJvbWlzZTxPdXRwdXQgfCB2b2lkPiB7XG4gICAgaWYgKCF0aGlzLiNhdXRoPy5sZW5ndGgpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbiBhdXRoIGtleSBpcyByZXF1aXJlZCB0byB1c2UgUGFzdGVHRyN1cGRhdGUoKVwiKTtcblxuICAgIGlmICghb3B0aW9ucy5uYW1lKSBvcHRpb25zLm5hbWUgPSBudWxsO1xuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5QQVRDSCwgYC9wYXN0ZXMvJHtpZH1gLCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgeyBQYXN0ZUdHIH07XG5leHBvcnQgZGVmYXVsdCBQYXN0ZUdHO1xubW9kdWxlLmV4cG9ydHMgPSBQYXN0ZUdHOyAvLyBKUzogZGVmYXVsdCBpbXBvcnRcbm1vZHVsZS5leHBvcnRzLlBhc3RlR0cgPSBQYXN0ZUdHOyAvLyBKUzogZGVjb25zdHJ1Y3QgaW1wb3J0XG5cbi8qKlxuICogVGhlIGhlYWRlciBvcHRpb25zXG4gKiBAdHlwZWRlZiB7SUhlYWRlcn0gSUhlYWRlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtDb250ZW50LVR5cGVdIFRoZSByZXF1ZXN0IGNvbnRlbnQgdHlwZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtBdXRob3JpemF0aW9uXSBBdXRob3JpemF0aW9uIGZvciB0aGUgcmVxdWVzdFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09wdGlvbnN9IE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiYXNlVXJsIFRoZSBiYXNlIFVSTCBvZiB0aGUgQVBJXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbWFpblVybCBUaGUgVVJMIG9mIHRoZSBtYWluIHdlYnNpdGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB2ZXJzaW9uIFRoZSB2ZXJzaW9uIG9mIHRoZSBBUElcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtSZXN1bHR9IFJlc3VsdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmFtZSBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt1cmxdIFRoZSBVUkwgZm9yIHRoZSByZXN1bHRcbiAqIEBwcm9wZXJ0eSB7QXV0aG9yfSBbYXV0aG9yXSBUaGUgYXV0aG9yIG9mIHRoZSBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3B1YmxpYyB8IHVubGlzdGVkIHwgcHJpdmF0ZX0gW3Zpc2liaWxpdHk9dW5saXN0ZWRdIFRoZSB2aXNpYmlsaXR5IG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY3JlYXRlZF9hdCBUaGUgZGF0ZSB0aGUgcGFzdGUgd2FzIGNyZWF0ZWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB1cGRhdGVkX2F0IFRoZSBkYXRlIHRoZSBwYXN0ZSB3YXMgbGFzdCB1cGRhdGVkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2V4cGlyZXNdIFRoZSBkYXRlIHdoZW4gdGhlIHBhc3RlIGV4cGlyZXNcbiAqIEBwcm9wZXJ0eSB7RmlsZVtdfSBbZmlsZXNdIFRoZSBmaWxlcyB1c2VkIGluIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2RlbGV0aW9uX2tleV0gVGhlIGRlbGV0aW9uIGtleSBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge091dHB1dH0gT3V0cHV0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gc3RhdHVzIFRoZSBvdXRwdXQgc3RhdHVzXG4gKiBAcHJvcGVydHkge1Jlc3VsdH0gW3Jlc3VsdF0gVGhlIHJlc3VsdCBkYXRhIG9iamVjdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtlcnJvcl0gVGhlIGVycm9yIGtleVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFttZXNzYWdlXSBUaGUgZXJyb3IgbWVzc2FnZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1Bvc3R9IFBvc3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIHBhc3RlIChtdXN0IGJlIGxlc3MgdGhhbiAyNSBLaUIpXG4gKiBAcHJvcGVydHkge3B1YmxpYyB8IHVubGlzdGVkIHwgcHJpdmF0ZX0gW3Zpc2liaWxpdHk9dW5saXN0ZWRdIFRoZSB2aXNpYmlsaXR5IG9mIHRoZSBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtleHBpcmVzXSBUaGUgZXhwaXJhdGlvbiBkYXRlIG9mIHRoZSBwYXN0ZSAobXVzdCBiZSBhIFVUQyBJU08gODYwMSBzdHJpbmcpXG4gKiBAcHJvcGVydHkge0ZpbGVPdXRbXX0gZmlsZXMgQXJyYXkgb2YgZmlsZXMgdG8gYWRkIHRvIHRoZSBwYXN0ZSAoYXQgbGVhc3Qgb25lIGZpbGUpXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7QXV0aG9yfSBBdXRob3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaWRdIFRoZSBJRCBvZiB0aGUgYXV0aG9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3VzZXJuYW1lXSBUaGUgdXNlcm5hbWUgb2YgdGhlIGF1dGhvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmFtZSBvZiB0aGUgYXV0aG9yXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7VXBkYXRlfSBVcGRhdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5ldyBuYW1lIG9mIHRoZSBwb3N0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGVzY3JpcHRpb24gVGhlIG5ldyBkZXNjcmlwdGlvbiBvZiB0aGUgcG9zdFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0ZpbGV9IEZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IG51bGx9IGhpZ2hsaWdodF9sYW5ndWFnZSBUaGUgc3ludGF4IGhpZ2hsaWdodGluZyBsYW5ndWFnZSB1c2VkXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7Q29udGVudH0gQ29udGVudFxuICogQHByb3BlcnR5IHt0ZXh0IHwgYmFzZTY0IHwgZ3ppcCB8IHh6fSBmb3JtYXQgVGhlIGZvcm1hdCBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtoaWdobGlnaHRfbGFuZ3VhZ2VdIFRoZSBzeW50YXggaGlnaGxpZ2h0aW5nIGxhbmd1YWdlIHRvIHVzZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgZmlsZSBjb250ZW50c1xuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0ZpbGVPdXR9IEZpbGVPdXRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7Q29udGVudH0gY29udGVudCBUaGUgY29udGVudCBvZiB0aGUgZmlsZVxuICovXG4iXX0=