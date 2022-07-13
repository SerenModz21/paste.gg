"use strict";
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
const node_fetch_1 = __importDefault(require("node-fetch"));
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
     * @example
     * // If you want to be anonymous
     * const pasteGG = new PasteGG()
     *
     * // If you want to use an api key
     * const pasteGG = new PasteGG("apiKeyHere")
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
            urlPath += `?${(0, querystring_1.stringify)(body)}`;
        const res = await (0, node_fetch_1.default)(urlPath, {
            method,
            headers,
            body: body && method !== "GET" ? JSON.stringify(body) : null,
        });
        return res.json();
    }
    /**
     * Get an existing paste.
     * @see https://github.com/ascclemens/paste/blob/master/api.md#get-pastesid
     * @param {string} id The ID of the paste.
     * @param {boolean} full Includes the contents of files if true.
     * @returns {Promise<Output>}
     * @public
     * @example
     * // if you would like to exclude file contents
     * await pasteGG.get("idHere")
     *
     * // If you would like to include file contents
     * await pasteGG.get("idHere", true)
     */
    async get(id, full = false) {
        if (!(id === null || id === void 0 ? void 0 : id.length)) {
            throw new Error("A paste ID is required to use PasteGG#get()");
        }
        return this._request(interfaces_1.Methods.GET, `/pastes/${id}`, { full });
    }
    /**
     * Create a new paste.
     * @see https://github.com/ascclemens/paste/blob/master/api.md#post-pastes
     * @param {Post} input The information to create the paste with.
     * @returns {Promise<Output>}
     * @public
     * @example
     * await pasteGG.post({
     *   name: "Paste name", // Optional
     *   description: "Paste description", // Optional
     *   expires: "2020-12-21T02:25:56.428Z", // Optional (must be a UTC ISO 8601 string)
     *   files: [{
     *     name: "file.txt", // Optional
     *     content: {
     *       format: "text",
     *       value: "This is where the file content will go"
     *     }
     *   }]
     * })
     */
    async post(input) {
        if (!input) {
            throw new Error("An input object is required to use PasteGG#post()");
        }
        const res = await this._request(interfaces_1.Methods.POST, "/pastes", input);
        if (res.result)
            res.result.url = `${this.options.mainUrl}/${res.result.id}`;
        return res;
    }
    /**
     * Deletes an existing paste.
     * @see https://github.com/ascclemens/paste/blob/master/api.md#delete-pastesid
     * @param {string} id The ID of the paste to delete.
     * @param {string} [key] Auth key or deletion key (leave blank if you have set the auth key in the constructor)
     * @returns {Promise<Output | void>}
     * @public
     * @example
     * // Delete with deletion key
     * await pasteGG.delete("idHere", "deletionKeyHere")
     *
     * // Delete with auth key if not set in constructor
     * await pasteGG.delete("idHere", "authKeyHere")
     *
     * // Leave blank if auth key is in the class constructor
     * await pasteGG.delete("idHere")
     */
    async delete(id, key) {
        var _a;
        if (!((_a = __classPrivateFieldGet(this, _PasteGG_auth, "f")) === null || _a === void 0 ? void 0 : _a.length) && !(key === null || key === void 0 ? void 0 : key.length))
            throw new Error("An auth key or deletion key is needed to use PasteGG#delete()");
        return this._request(interfaces_1.Methods.DELETE, `/pastes/${id}`, null, key);
    }
    /**
     * Update an existing paste.
     * @see https://github.com/ascclemens/paste/blob/master/api.md#patch-pastesid
     * @param {string} id The ID for the paste to update.
     * @param {Update} options The options you wish to update.
     * @returns {Promise<Output | void>}
     * @public
     * @example
     * await pasteGG.update("idHere", {
     *   name: "new name", // Optional (if you want to remove the name)
     *   description: "new description"
     * })
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
 * @property {string} [baseUrl=https://api.paste.gg] The base URL of the API
 * @property {string} [mainUrl=https://paste.gg] The URL of the main website
 * @property {number} [version=1] The version of the API
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNERBQStCO0FBQy9CLDZDQUFzRTtBQUN0RSw2Q0FXc0I7QUFFdEIsTUFBTSxjQUFjLEdBQVk7SUFDOUIsT0FBTyxFQUFFLHNCQUFzQjtJQUMvQixPQUFPLEVBQUUsa0JBQWtCO0lBQzNCLE9BQU8sRUFBRSxDQUFDO0NBQ1gsQ0FBQztBQUVGOztHQUVHO0FBQ0gsTUFBTSxPQUFPO0lBTVg7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsWUFBWSxJQUFhLEVBQUUsVUFBbUIsY0FBYztRQWxCNUQsZ0NBQXVCO1FBQ3ZCLCtCQUFzQjtRQWtCcEI7Ozs7O1dBS0c7UUFDSCx1QkFBQSxJQUFJLGlCQUFTLElBQUksTUFBQSxDQUFDO1FBQ2xCOzs7OztXQUtHO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFtQixjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDeEU7Ozs7O1dBS0c7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEQ7Ozs7O1dBS0c7UUFDSCx1QkFBQSxJQUFJLGdCQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBQSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLEtBQUssQ0FBQyxRQUFRLENBQ3BCLE1BQTRCLEVBQzVCLElBQVksRUFDWixJQUFhLEVBQ2IsR0FBWTtRQUVaLE1BQU0sT0FBTyxHQUFZLEVBQUUsQ0FBQztRQUM1QixJQUFJLHVCQUFBLElBQUkscUJBQU07WUFBRSxPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sdUJBQUEsSUFBSSxxQkFBTSxFQUFFLENB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dkMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFTLG9CQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEUsQ0FBQztDQUNGO0FBRVEsMEJBQU87O0FBQ2hCLGtCQUFlLE9BQU8sQ0FBQztBQUN2QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQjtBQUMvQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyx5QkFBeUI7QUFFM0Q7Ozs7O0dBS0c7QUFFSDs7Ozs7R0FLRztBQUVIOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFFSDs7Ozs7O0dBTUc7QUFFSDs7Ozs7OztHQU9HO0FBRUg7Ozs7O0dBS0c7QUFFSDs7OztHQUlHO0FBRUg7Ozs7O0dBS0c7QUFFSDs7Ozs7R0FLRztBQUVIOzs7O0dBSUciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmV0Y2ggZnJvbSBcIm5vZGUtZmV0Y2hcIjtcbmltcG9ydCB7IFBhcnNlZFVybFF1ZXJ5SW5wdXQgYXMgSW5wdXQsIHN0cmluZ2lmeSB9IGZyb20gXCJxdWVyeXN0cmluZ1wiO1xuaW1wb3J0IHtcbiAgQXV0aG9yLFxuICBDb250ZW50LFxuICBGaWxlLFxuICBJSGVhZGVyLFxuICBNZXRob2RzLFxuICBPcHRpb25zLFxuICBPdXRwdXQsXG4gIFBvc3QsXG4gIFJlc3VsdCxcbiAgVXBkYXRlLFxufSBmcm9tIFwiLi9pbnRlcmZhY2VzXCI7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0gPE9wdGlvbnM+e1xuICBiYXNlVXJsOiBcImh0dHBzOi8vYXBpLnBhc3RlLmdnXCIsXG4gIG1haW5Vcmw6IFwiaHR0cHM6Ly9wYXN0ZS5nZ1wiLFxuICB2ZXJzaW9uOiAxLFxufTtcblxuLyoqXG4gKiBUaGUgbWFpbiBjbGFzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCB0aGUgUGFzdGUuZ2cgQVBJXG4gKi9cbmNsYXNzIFBhc3RlR0cge1xuICByZWFkb25seSAjYXV0aDogc3RyaW5nO1xuICByZWFkb25seSAjdXJsOiBzdHJpbmc7XG4gIHJlYWRvbmx5IG9wdGlvbnM6IE9wdGlvbnM7XG4gIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIFBhc3RlR0dcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1dGggT3B0aW9uYWwgYXV0aCBrZXlcbiAgICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBwYXN0ZSBzZXJ2ZXJcbiAgICogQGNsYXNzIFBhc3RlR0dcbiAgICogQHB1YmxpY1xuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBJZiB5b3Ugd2FudCB0byBiZSBhbm9ueW1vdXNcbiAgICogY29uc3QgcGFzdGVHRyA9IG5ldyBQYXN0ZUdHKClcbiAgICpcbiAgICogLy8gSWYgeW91IHdhbnQgdG8gdXNlIGFuIGFwaSBrZXlcbiAgICogY29uc3QgcGFzdGVHRyA9IG5ldyBQYXN0ZUdHKFwiYXBpS2V5SGVyZVwiKVxuICAgKi9cbiAgY29uc3RydWN0b3IoYXV0aD86IHN0cmluZywgb3B0aW9uczogT3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zKSB7XG4gICAgLyoqXG4gICAgICogVGhlIGF1dGgga2V5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuI2F1dGggPSBhdXRoO1xuICAgIC8qKlxuICAgICAqIFRoZSBvcHRpb25zIGZvciB0aGUgcGFzdGUgc2VydmVyXG4gICAgICogQHR5cGUge09wdGlvbnN9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ248T3B0aW9ucywgT3B0aW9ucz4oZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBBUEkgd3JhcHBlclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMudmVyc2lvbiA9IGB2JHtyZXF1aXJlKFwiLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259YDtcbiAgICAvKipcbiAgICAgKiBUaGUgZnVsbCBVUkwgZm9yIHRoZSBBUElcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy4jdXJsID0gYCR7dGhpcy5vcHRpb25zLmJhc2VVcmx9L3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufWA7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhIHJlcXVlc3QgdG8gdGhlIEFQSS5cbiAgICogQHBhcmFtIHtrZXlvZiB0eXBlb2YgTWV0aG9kc30gbWV0aG9kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBib2R5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHJldHVybnMge1Byb21pc2U8VD59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIF9yZXF1ZXN0PFQ+KFxuICAgIG1ldGhvZDoga2V5b2YgdHlwZW9mIE1ldGhvZHMsXG4gICAgcGF0aDogc3RyaW5nLFxuICAgIGJvZHk/OiBvYmplY3QsXG4gICAga2V5Pzogc3RyaW5nXG4gICk6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IGhlYWRlcnM6IElIZWFkZXIgPSB7fTtcbiAgICBpZiAodGhpcy4jYXV0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke3RoaXMuI2F1dGh9YDtcbiAgICBpZiAoa2V5Py5sZW5ndGgpIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBLZXkgJHtrZXl9YDtcbiAgICBpZiAobWV0aG9kICE9PSBcIkdFVFwiKSBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XG5cbiAgICBsZXQgdXJsUGF0aCA9IGAke3RoaXMuI3VybH0ke3BhdGh9YDtcbiAgICBpZiAoYm9keSAmJiBtZXRob2QgPT09IFwiR0VUXCIpIHVybFBhdGggKz0gYD8ke3N0cmluZ2lmeSg8SW5wdXQ+Ym9keSl9YDtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybFBhdGgsIHtcbiAgICAgIG1ldGhvZCxcbiAgICAgIGhlYWRlcnMsXG4gICAgICBib2R5OiBib2R5ICYmIG1ldGhvZCAhPT0gXCJHRVRcIiA/IEpTT04uc3RyaW5naWZ5KGJvZHkpIDogbnVsbCxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXNjY2xlbWVucy9wYXN0ZS9ibG9iL21hc3Rlci9hcGkubWQjZ2V0LXBhc3Rlc2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIHBhc3RlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZ1bGwgSW5jbHVkZXMgdGhlIGNvbnRlbnRzIG9mIGZpbGVzIGlmIHRydWUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE91dHB1dD59XG4gICAqIEBwdWJsaWNcbiAgICogQGV4YW1wbGVcbiAgICogLy8gaWYgeW91IHdvdWxkIGxpa2UgdG8gZXhjbHVkZSBmaWxlIGNvbnRlbnRzXG4gICAqIGF3YWl0IHBhc3RlR0cuZ2V0KFwiaWRIZXJlXCIpXG4gICAqXG4gICAqIC8vIElmIHlvdSB3b3VsZCBsaWtlIHRvIGluY2x1ZGUgZmlsZSBjb250ZW50c1xuICAgKiBhd2FpdCBwYXN0ZUdHLmdldChcImlkSGVyZVwiLCB0cnVlKVxuICAgKi9cbiAgYXN5bmMgZ2V0KGlkOiBzdHJpbmcsIGZ1bGw6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8T3V0cHV0PiB7XG4gICAgaWYgKCFpZD8ubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBIHBhc3RlIElEIGlzIHJlcXVpcmVkIHRvIHVzZSBQYXN0ZUdHI2dldCgpXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5HRVQsIGAvcGFzdGVzLyR7aWR9YCwgeyBmdWxsIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBwYXN0ZS5cbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXNjY2xlbWVucy9wYXN0ZS9ibG9iL21hc3Rlci9hcGkubWQjcG9zdC1wYXN0ZXNcbiAgICogQHBhcmFtIHtQb3N0fSBpbnB1dCBUaGUgaW5mb3JtYXRpb24gdG8gY3JlYXRlIHRoZSBwYXN0ZSB3aXRoLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqIEBleGFtcGxlXG4gICAqIGF3YWl0IHBhc3RlR0cucG9zdCh7XG4gICAqICAgbmFtZTogXCJQYXN0ZSBuYW1lXCIsIC8vIE9wdGlvbmFsXG4gICAqICAgZGVzY3JpcHRpb246IFwiUGFzdGUgZGVzY3JpcHRpb25cIiwgLy8gT3B0aW9uYWxcbiAgICogICBleHBpcmVzOiBcIjIwMjAtMTItMjFUMDI6MjU6NTYuNDI4WlwiLCAvLyBPcHRpb25hbCAobXVzdCBiZSBhIFVUQyBJU08gODYwMSBzdHJpbmcpXG4gICAqICAgZmlsZXM6IFt7XG4gICAqICAgICBuYW1lOiBcImZpbGUudHh0XCIsIC8vIE9wdGlvbmFsXG4gICAqICAgICBjb250ZW50OiB7XG4gICAqICAgICAgIGZvcm1hdDogXCJ0ZXh0XCIsXG4gICAqICAgICAgIHZhbHVlOiBcIlRoaXMgaXMgd2hlcmUgdGhlIGZpbGUgY29udGVudCB3aWxsIGdvXCJcbiAgICogICAgIH1cbiAgICogICB9XVxuICAgKiB9KVxuICAgKi9cbiAgYXN5bmMgcG9zdChpbnB1dDogUG9zdCk6IFByb21pc2U8T3V0cHV0PiB7XG4gICAgaWYgKCFpbnB1dCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gaW5wdXQgb2JqZWN0IGlzIHJlcXVpcmVkIHRvIHVzZSBQYXN0ZUdHI3Bvc3QoKVwiKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5QT1NULCBcIi9wYXN0ZXNcIiwgaW5wdXQpO1xuICAgIGlmIChyZXMucmVzdWx0KSByZXMucmVzdWx0LnVybCA9IGAke3RoaXMub3B0aW9ucy5tYWluVXJsfS8ke3Jlcy5yZXN1bHQuaWR9YDtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FzY2NsZW1lbnMvcGFzdGUvYmxvYi9tYXN0ZXIvYXBpLm1kI2RlbGV0ZS1wYXN0ZXNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZSB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBBdXRoIGtleSBvciBkZWxldGlvbiBrZXkgKGxlYXZlIGJsYW5rIGlmIHlvdSBoYXZlIHNldCB0aGUgYXV0aCBrZXkgaW4gdGhlIGNvbnN0cnVjdG9yKVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQgfCB2b2lkPn1cbiAgICogQHB1YmxpY1xuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBEZWxldGUgd2l0aCBkZWxldGlvbiBrZXlcbiAgICogYXdhaXQgcGFzdGVHRy5kZWxldGUoXCJpZEhlcmVcIiwgXCJkZWxldGlvbktleUhlcmVcIilcbiAgICpcbiAgICogLy8gRGVsZXRlIHdpdGggYXV0aCBrZXkgaWYgbm90IHNldCBpbiBjb25zdHJ1Y3RvclxuICAgKiBhd2FpdCBwYXN0ZUdHLmRlbGV0ZShcImlkSGVyZVwiLCBcImF1dGhLZXlIZXJlXCIpXG4gICAqXG4gICAqIC8vIExlYXZlIGJsYW5rIGlmIGF1dGgga2V5IGlzIGluIHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxuICAgKiBhd2FpdCBwYXN0ZUdHLmRlbGV0ZShcImlkSGVyZVwiKVxuICAgKi9cbiAgYXN5bmMgZGVsZXRlKGlkOiBzdHJpbmcsIGtleT86IHN0cmluZyk6IFByb21pc2U8T3V0cHV0IHwgdm9pZD4ge1xuICAgIGlmICghdGhpcy4jYXV0aD8ubGVuZ3RoICYmICFrZXk/Lmxlbmd0aClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJBbiBhdXRoIGtleSBvciBkZWxldGlvbiBrZXkgaXMgbmVlZGVkIHRvIHVzZSBQYXN0ZUdHI2RlbGV0ZSgpXCJcbiAgICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdDxPdXRwdXQ+KE1ldGhvZHMuREVMRVRFLCBgL3Bhc3Rlcy8ke2lkfWAsIG51bGwsIGtleSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2NjbGVtZW5zL3Bhc3RlL2Jsb2IvbWFzdGVyL2FwaS5tZCNwYXRjaC1wYXN0ZXNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIGZvciB0aGUgcGFzdGUgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge1VwZGF0ZX0gb3B0aW9ucyBUaGUgb3B0aW9ucyB5b3Ugd2lzaCB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPE91dHB1dCB8IHZvaWQ+fVxuICAgKiBAcHVibGljXG4gICAqIEBleGFtcGxlXG4gICAqIGF3YWl0IHBhc3RlR0cudXBkYXRlKFwiaWRIZXJlXCIsIHtcbiAgICogICBuYW1lOiBcIm5ldyBuYW1lXCIsIC8vIE9wdGlvbmFsIChpZiB5b3Ugd2FudCB0byByZW1vdmUgdGhlIG5hbWUpXG4gICAqICAgZGVzY3JpcHRpb246IFwibmV3IGRlc2NyaXB0aW9uXCJcbiAgICogfSlcbiAgICovXG4gIGFzeW5jIHVwZGF0ZShpZDogc3RyaW5nLCBvcHRpb25zOiBVcGRhdGUpOiBQcm9taXNlPE91dHB1dCB8IHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuI2F1dGg/Lmxlbmd0aClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGF1dGgga2V5IGlzIHJlcXVpcmVkIHRvIHVzZSBQYXN0ZUdHI3VwZGF0ZSgpXCIpO1xuXG4gICAgaWYgKCFvcHRpb25zLm5hbWUpIG9wdGlvbnMubmFtZSA9IG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihNZXRob2RzLlBBVENILCBgL3Bhc3Rlcy8ke2lkfWAsIG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCB7IFBhc3RlR0cgfTtcbmV4cG9ydCBkZWZhdWx0IFBhc3RlR0c7XG5tb2R1bGUuZXhwb3J0cyA9IFBhc3RlR0c7IC8vIEpTOiBkZWZhdWx0IGltcG9ydFxubW9kdWxlLmV4cG9ydHMuUGFzdGVHRyA9IFBhc3RlR0c7IC8vIEpTOiBkZWNvbnN0cnVjdCBpbXBvcnRcblxuLyoqXG4gKiBUaGUgaGVhZGVyIG9wdGlvbnNcbiAqIEB0eXBlZGVmIHtJSGVhZGVyfSBJSGVhZGVyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW0NvbnRlbnQtVHlwZV0gVGhlIHJlcXVlc3QgY29udGVudCB0eXBlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW0F1dGhvcml6YXRpb25dIEF1dGhvcml6YXRpb24gZm9yIHRoZSByZXF1ZXN0XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T3B0aW9uc30gT3B0aW9uc1xuICogQHByb3BlcnR5IHtzdHJpbmd9IFtiYXNlVXJsPWh0dHBzOi8vYXBpLnBhc3RlLmdnXSBUaGUgYmFzZSBVUkwgb2YgdGhlIEFQSVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFttYWluVXJsPWh0dHBzOi8vcGFzdGUuZ2ddIFRoZSBVUkwgb2YgdGhlIG1haW4gd2Vic2l0ZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IFt2ZXJzaW9uPTFdIFRoZSB2ZXJzaW9uIG9mIHRoZSBBUElcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtSZXN1bHR9IFJlc3VsdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmFtZSBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt1cmxdIFRoZSBVUkwgZm9yIHRoZSByZXN1bHRcbiAqIEBwcm9wZXJ0eSB7QXV0aG9yfSBbYXV0aG9yXSBUaGUgYXV0aG9yIG9mIHRoZSBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3B1YmxpYyB8IHVubGlzdGVkIHwgcHJpdmF0ZX0gW3Zpc2liaWxpdHk9dW5saXN0ZWRdIFRoZSB2aXNpYmlsaXR5IG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gY3JlYXRlZF9hdCBUaGUgZGF0ZSB0aGUgcGFzdGUgd2FzIGNyZWF0ZWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB1cGRhdGVkX2F0IFRoZSBkYXRlIHRoZSBwYXN0ZSB3YXMgbGFzdCB1cGRhdGVkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2V4cGlyZXNdIFRoZSBkYXRlIHdoZW4gdGhlIHBhc3RlIGV4cGlyZXNcbiAqIEBwcm9wZXJ0eSB7RmlsZVtdfSBbZmlsZXNdIFRoZSBmaWxlcyB1c2VkIGluIHRoZSBjcmVhdGVkIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2RlbGV0aW9uX2tleV0gVGhlIGRlbGV0aW9uIGtleSBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge091dHB1dH0gT3V0cHV0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gc3RhdHVzIFRoZSBvdXRwdXQgc3RhdHVzXG4gKiBAcHJvcGVydHkge1Jlc3VsdH0gW3Jlc3VsdF0gVGhlIHJlc3VsdCBkYXRhIG9iamVjdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtlcnJvcl0gVGhlIGVycm9yIGtleVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFttZXNzYWdlXSBUaGUgZXJyb3IgbWVzc2FnZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1Bvc3R9IFBvc3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIHBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIHBhc3RlIChtdXN0IGJlIGxlc3MgdGhhbiAyNSBLaUIpXG4gKiBAcHJvcGVydHkge3B1YmxpYyB8IHVubGlzdGVkIHwgcHJpdmF0ZX0gW3Zpc2liaWxpdHk9dW5saXN0ZWRdIFRoZSB2aXNpYmlsaXR5IG9mIHRoZSBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtleHBpcmVzXSBUaGUgZXhwaXJhdGlvbiBkYXRlIG9mIHRoZSBwYXN0ZSAobXVzdCBiZSBhIFVUQyBJU08gODYwMSBzdHJpbmcpXG4gKiBAcHJvcGVydHkge0ZpbGVPdXRbXX0gZmlsZXMgQXJyYXkgb2YgZmlsZXMgdG8gYWRkIHRvIHRoZSBwYXN0ZSAoYXQgbGVhc3Qgb25lIGZpbGUpXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7QXV0aG9yfSBBdXRob3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaWRdIFRoZSBJRCBvZiB0aGUgYXV0aG9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3VzZXJuYW1lXSBUaGUgdXNlcm5hbWUgb2YgdGhlIGF1dGhvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmFtZSBvZiB0aGUgYXV0aG9yXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7VXBkYXRlfSBVcGRhdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5ldyBuYW1lIG9mIHRoZSBwb3N0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gZGVzY3JpcHRpb24gVGhlIG5ldyBkZXNjcmlwdGlvbiBvZiB0aGUgcG9zdFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0ZpbGV9IEZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IG51bGx9IGhpZ2hsaWdodF9sYW5ndWFnZSBUaGUgc3ludGF4IGhpZ2hsaWdodGluZyBsYW5ndWFnZSB1c2VkXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7Q29udGVudH0gQ29udGVudFxuICogQHByb3BlcnR5IHt0ZXh0IHwgYmFzZTY0IHwgZ3ppcCB8IHh6fSBmb3JtYXQgVGhlIGZvcm1hdCBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtoaWdobGlnaHRfbGFuZ3VhZ2VdIFRoZSBzeW50YXggaGlnaGxpZ2h0aW5nIGxhbmd1YWdlIHRvIHVzZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgZmlsZSBjb250ZW50c1xuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0ZpbGVPdXR9IEZpbGVPdXRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7Q29udGVudH0gY29udGVudCBUaGUgY29udGVudCBvZiB0aGUgZmlsZVxuICovXG4iXX0=