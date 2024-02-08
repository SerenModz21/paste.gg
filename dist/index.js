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
var _PasteGG_auth, _PasteGG_url;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasteGG = void 0;
const node_querystring_1 = require("node:querystring");
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
            urlPath += `?${(0, node_querystring_1.stringify)(body)}`;
        const res = await fetch(urlPath, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdURBQXVFO0FBQ3ZFLDZDQU9zQjtBQUV0QixNQUFNLGNBQWMsR0FBWTtJQUM1QixPQUFPLEVBQUUsc0JBQXNCO0lBQy9CLE9BQU8sRUFBRSxrQkFBa0I7SUFDM0IsT0FBTyxFQUFFLENBQUM7Q0FDYixDQUFDO0FBRUY7O0dBRUc7QUFDSCxNQUFNLE9BQU87SUFNVDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxZQUFZLElBQWEsRUFBRSxVQUFtQixjQUFjO1FBbEJuRCxnQ0FBYztRQUNkLCtCQUFhO1FBa0JsQjs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksaUJBQVMsSUFBSSxNQUFBLENBQUM7UUFDbEI7Ozs7O1dBS0c7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQW1CLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4RTs7Ozs7V0FLRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4RDs7Ozs7V0FLRztRQUNILHVCQUFBLElBQUksZ0JBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFBLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssS0FBSyxDQUFDLFFBQVEsQ0FDbEIsTUFBNEIsRUFDNUIsSUFBWSxFQUNaLElBQWEsRUFDYixHQUFZO1FBRVosTUFBTSxPQUFPLEdBQVksRUFBRSxDQUFDO1FBQzVCLElBQUksdUJBQUEsSUFBSSxxQkFBTTtZQUFFLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyx1QkFBQSxJQUFJLHFCQUFNLEVBQUUsQ0FBQztRQUM1RCxJQUFJLEdBQUcs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QUFPLElBQUksQ0FBQyxRQUFRLENBQVMsb0JBQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxRSxDQUFDO0NBQ0o7QUFFUSwwQkFBTzs7QUFDaEIsa0JBQWUsT0FBTyxDQUFDO0FBQ3ZCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMscUJBQXFCO0FBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLHlCQUF5QjtBQUUzRDs7Ozs7R0FLRztBQUVIOzs7OztHQUtHO0FBRUg7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUVIOzs7Ozs7R0FNRztBQUVIOzs7Ozs7O0dBT0c7QUFFSDs7Ozs7R0FLRztBQUVIOzs7O0dBSUc7QUFFSDs7Ozs7R0FLRztBQUVIOzs7OztHQUtHO0FBRUg7Ozs7R0FJRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHN0cmluZ2lmeSwgdHlwZSBQYXJzZWRVcmxRdWVyeUlucHV0IH0gZnJvbSBcIm5vZGU6cXVlcnlzdHJpbmdcIjtcbmltcG9ydCB7XG4gICAgTWV0aG9kcyxcbiAgICB0eXBlIElIZWFkZXIsXG4gICAgdHlwZSBPcHRpb25zLFxuICAgIHR5cGUgT3V0cHV0LFxuICAgIHR5cGUgUG9zdCxcbiAgICB0eXBlIFVwZGF0ZSxcbn0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IDxPcHRpb25zPntcbiAgICBiYXNlVXJsOiBcImh0dHBzOi8vYXBpLnBhc3RlLmdnXCIsXG4gICAgbWFpblVybDogXCJodHRwczovL3Bhc3RlLmdnXCIsXG4gICAgdmVyc2lvbjogMSxcbn07XG5cbi8qKlxuICogVGhlIG1haW4gY2xhc3MgZm9yIGludGVyYWN0aW5nIHdpdGggdGhlIFBhc3RlLmdnIEFQSVxuICovXG5jbGFzcyBQYXN0ZUdHIHtcbiAgICByZWFkb25seSAjYXV0aDogc3RyaW5nO1xuICAgIHJlYWRvbmx5ICN1cmw6IHN0cmluZztcbiAgICByZWFkb25seSBvcHRpb25zOiBPcHRpb25zO1xuICAgIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBQYXN0ZUdHXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGF1dGggT3B0aW9uYWwgYXV0aCBrZXlcbiAgICAgKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgICAqIEBjbGFzcyBQYXN0ZUdHXG4gICAgICogQHB1YmxpY1xuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gSWYgeW91IHdhbnQgdG8gYmUgYW5vbnltb3VzXG4gICAgICogY29uc3QgcGFzdGVHRyA9IG5ldyBQYXN0ZUdHKClcbiAgICAgKlxuICAgICAqIC8vIElmIHlvdSB3YW50IHRvIHVzZSBhbiBhcGkga2V5XG4gICAgICogY29uc3QgcGFzdGVHRyA9IG5ldyBQYXN0ZUdHKFwiYXBpS2V5SGVyZVwiKVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGF1dGg/OiBzdHJpbmcsIG9wdGlvbnM6IE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucykge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGF1dGgga2V5XG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy4jYXV0aCA9IGF1dGg7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgb3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgICAgICAgKiBAdHlwZSB7T3B0aW9uc31cbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ248T3B0aW9ucywgT3B0aW9ucz4oZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHZlcnNpb24gb2YgdGhlIEFQSSB3cmFwcGVyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnZlcnNpb24gPSBgdiR7cmVxdWlyZShcIi4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9ufWA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZnVsbCBVUkwgZm9yIHRoZSBBUElcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLiN1cmwgPSBgJHt0aGlzLm9wdGlvbnMuYmFzZVVybH0vdiR7dGhpcy5vcHRpb25zLnZlcnNpb259YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNYWtlIGEgcmVxdWVzdCB0byB0aGUgQVBJLlxuICAgICAqIEBwYXJhbSB7a2V5b2YgdHlwZW9mIE1ldGhvZHN9IG1ldGhvZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGJvZHlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICogQHJldHVybnMge1Byb21pc2U8VD59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9yZXF1ZXN0PFQ+KFxuICAgICAgICBtZXRob2Q6IGtleW9mIHR5cGVvZiBNZXRob2RzLFxuICAgICAgICBwYXRoOiBzdHJpbmcsXG4gICAgICAgIGJvZHk/OiBvYmplY3QsXG4gICAgICAgIGtleT86IHN0cmluZyxcbiAgICApOiBQcm9taXNlPFQ+IHtcbiAgICAgICAgY29uc3QgaGVhZGVyczogSUhlYWRlciA9IHt9O1xuICAgICAgICBpZiAodGhpcy4jYXV0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke3RoaXMuI2F1dGh9YDtcbiAgICAgICAgaWYgKGtleT8ubGVuZ3RoKSBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgS2V5ICR7a2V5fWA7XG4gICAgICAgIGlmIChtZXRob2QgIT09IFwiR0VUXCIpIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcblxuICAgICAgICBsZXQgdXJsUGF0aCA9IGAke3RoaXMuI3VybH0ke3BhdGh9YDtcbiAgICAgICAgaWYgKGJvZHkgJiYgbWV0aG9kID09PSBcIkdFVFwiKSB1cmxQYXRoICs9IGA/JHtzdHJpbmdpZnkoYm9keSBhcyBQYXJzZWRVcmxRdWVyeUlucHV0KX1gO1xuXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybFBhdGgsIHtcbiAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnMsXG4gICAgICAgICAgICBib2R5OiBib2R5ICYmIG1ldGhvZCAhPT0gXCJHRVRcIiA/IEpTT04uc3RyaW5naWZ5KGJvZHkpIDogbnVsbCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FzY2NsZW1lbnMvcGFzdGUvYmxvYi9tYXN0ZXIvYXBpLm1kI2dldC1wYXN0ZXNpZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIHBhc3RlLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZnVsbCBJbmNsdWRlcyB0aGUgY29udGVudHMgb2YgZmlsZXMgaWYgdHJ1ZS5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQ+fVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIGlmIHlvdSB3b3VsZCBsaWtlIHRvIGV4Y2x1ZGUgZmlsZSBjb250ZW50c1xuICAgICAqIGF3YWl0IHBhc3RlR0cuZ2V0KFwiaWRIZXJlXCIpXG4gICAgICpcbiAgICAgKiAvLyBJZiB5b3Ugd291bGQgbGlrZSB0byBpbmNsdWRlIGZpbGUgY29udGVudHNcbiAgICAgKiBhd2FpdCBwYXN0ZUdHLmdldChcImlkSGVyZVwiLCB0cnVlKVxuICAgICAqL1xuICAgIGFzeW5jIGdldChpZDogc3RyaW5nLCBmdWxsOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPE91dHB1dD4ge1xuICAgICAgICBpZiAoIWlkPy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkEgcGFzdGUgSUQgaXMgcmVxdWlyZWQgdG8gdXNlIFBhc3RlR0cjZ2V0KClcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdDxPdXRwdXQ+KE1ldGhvZHMuR0VULCBgL3Bhc3Rlcy8ke2lkfWAsIHsgZnVsbCB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgcGFzdGUuXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXNjY2xlbWVucy9wYXN0ZS9ibG9iL21hc3Rlci9hcGkubWQjcG9zdC1wYXN0ZXNcbiAgICAgKiBAcGFyYW0ge1Bvc3R9IGlucHV0IFRoZSBpbmZvcm1hdGlvbiB0byBjcmVhdGUgdGhlIHBhc3RlIHdpdGguXG4gICAgICogQHJldHVybnMge1Byb21pc2U8T3V0cHV0Pn1cbiAgICAgKiBAcHVibGljXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBhd2FpdCBwYXN0ZUdHLnBvc3Qoe1xuICAgICAqICAgbmFtZTogXCJQYXN0ZSBuYW1lXCIsIC8vIE9wdGlvbmFsXG4gICAgICogICBkZXNjcmlwdGlvbjogXCJQYXN0ZSBkZXNjcmlwdGlvblwiLCAvLyBPcHRpb25hbFxuICAgICAqICAgZXhwaXJlczogXCIyMDIwLTEyLTIxVDAyOjI1OjU2LjQyOFpcIiwgLy8gT3B0aW9uYWwgKG11c3QgYmUgYSBVVEMgSVNPIDg2MDEgc3RyaW5nKVxuICAgICAqICAgZmlsZXM6IFt7XG4gICAgICogICAgIG5hbWU6IFwiZmlsZS50eHRcIiwgLy8gT3B0aW9uYWxcbiAgICAgKiAgICAgY29udGVudDoge1xuICAgICAqICAgICAgIGZvcm1hdDogXCJ0ZXh0XCIsXG4gICAgICogICAgICAgdmFsdWU6IFwiVGhpcyBpcyB3aGVyZSB0aGUgZmlsZSBjb250ZW50IHdpbGwgZ29cIlxuICAgICAqICAgICB9XG4gICAgICogICB9XVxuICAgICAqIH0pXG4gICAgICovXG4gICAgYXN5bmMgcG9zdChpbnB1dDogUG9zdCk6IFByb21pc2U8T3V0cHV0PiB7XG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBcIkFuIGlucHV0IG9iamVjdCBpcyByZXF1aXJlZCB0byB1c2UgUGFzdGVHRyNwb3N0KClcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLl9yZXF1ZXN0PE91dHB1dD4oTWV0aG9kcy5QT1NULCBcIi9wYXN0ZXNcIiwgaW5wdXQpO1xuICAgICAgICBpZiAocmVzLnJlc3VsdClcbiAgICAgICAgICAgIHJlcy5yZXN1bHQudXJsID0gYCR7dGhpcy5vcHRpb25zLm1haW5Vcmx9LyR7cmVzLnJlc3VsdC5pZH1gO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGV0ZXMgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXNjY2xlbWVucy9wYXN0ZS9ibG9iL21hc3Rlci9hcGkubWQjZGVsZXRlLXBhc3Rlc2lkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgcGFzdGUgdG8gZGVsZXRlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBBdXRoIGtleSBvciBkZWxldGlvbiBrZXkgKGxlYXZlIGJsYW5rIGlmIHlvdSBoYXZlIHNldCB0aGUgYXV0aCBrZXkgaW4gdGhlIGNvbnN0cnVjdG9yKVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPE91dHB1dCB8IHZvaWQ+fVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIC8vIERlbGV0ZSB3aXRoIGRlbGV0aW9uIGtleVxuICAgICAqIGF3YWl0IHBhc3RlR0cuZGVsZXRlKFwiaWRIZXJlXCIsIFwiZGVsZXRpb25LZXlIZXJlXCIpXG4gICAgICpcbiAgICAgKiAvLyBEZWxldGUgd2l0aCBhdXRoIGtleSBpZiBub3Qgc2V0IGluIGNvbnN0cnVjdG9yXG4gICAgICogYXdhaXQgcGFzdGVHRy5kZWxldGUoXCJpZEhlcmVcIiwgXCJhdXRoS2V5SGVyZVwiKVxuICAgICAqXG4gICAgICogLy8gTGVhdmUgYmxhbmsgaWYgYXV0aCBrZXkgaXMgaW4gdGhlIGNsYXNzIGNvbnN0cnVjdG9yXG4gICAgICogYXdhaXQgcGFzdGVHRy5kZWxldGUoXCJpZEhlcmVcIilcbiAgICAgKi9cbiAgICBhc3luYyBkZWxldGUoaWQ6IHN0cmluZywga2V5Pzogc3RyaW5nKTogUHJvbWlzZTxPdXRwdXQgfCB2b2lkPiB7XG4gICAgICAgIGlmICghdGhpcy4jYXV0aD8ubGVuZ3RoICYmICFrZXk/Lmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBcIkFuIGF1dGgga2V5IG9yIGRlbGV0aW9uIGtleSBpcyBuZWVkZWQgdG8gdXNlIFBhc3RlR0cjZGVsZXRlKClcIixcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3Q8T3V0cHV0PihcbiAgICAgICAgICAgIE1ldGhvZHMuREVMRVRFLFxuICAgICAgICAgICAgYC9wYXN0ZXMvJHtpZH1gLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXNjY2xlbWVucy9wYXN0ZS9ibG9iL21hc3Rlci9hcGkubWQjcGF0Y2gtcGFzdGVzaWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIGZvciB0aGUgcGFzdGUgdG8gdXBkYXRlLlxuICAgICAqIEBwYXJhbSB7VXBkYXRlfSBvcHRpb25zIFRoZSBvcHRpb25zIHlvdSB3aXNoIHRvIHVwZGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPdXRwdXQgfCB2b2lkPn1cbiAgICAgKiBAcHVibGljXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBhd2FpdCBwYXN0ZUdHLnVwZGF0ZShcImlkSGVyZVwiLCB7XG4gICAgICogICBuYW1lOiBcIm5ldyBuYW1lXCIsIC8vIE9wdGlvbmFsIChpZiB5b3Ugd2FudCB0byByZW1vdmUgdGhlIG5hbWUpXG4gICAgICogICBkZXNjcmlwdGlvbjogXCJuZXcgZGVzY3JpcHRpb25cIlxuICAgICAqIH0pXG4gICAgICovXG4gICAgYXN5bmMgdXBkYXRlKGlkOiBzdHJpbmcsIG9wdGlvbnM6IFVwZGF0ZSk6IFByb21pc2U8T3V0cHV0IHwgdm9pZD4ge1xuICAgICAgICBpZiAoIXRoaXMuI2F1dGg/Lmxlbmd0aClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGF1dGgga2V5IGlzIHJlcXVpcmVkIHRvIHVzZSBQYXN0ZUdHI3VwZGF0ZSgpXCIpO1xuXG4gICAgICAgIGlmICghb3B0aW9ucy5uYW1lKSBvcHRpb25zLm5hbWUgPSBudWxsO1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdDxPdXRwdXQ+KE1ldGhvZHMuUEFUQ0gsIGAvcGFzdGVzLyR7aWR9YCwgb3B0aW9ucyk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBQYXN0ZUdHIH07XG5leHBvcnQgZGVmYXVsdCBQYXN0ZUdHO1xubW9kdWxlLmV4cG9ydHMgPSBQYXN0ZUdHOyAvLyBKUzogZGVmYXVsdCBpbXBvcnRcbm1vZHVsZS5leHBvcnRzLlBhc3RlR0cgPSBQYXN0ZUdHOyAvLyBKUzogZGVjb25zdHJ1Y3QgaW1wb3J0XG5cbi8qKlxuICogVGhlIGhlYWRlciBvcHRpb25zXG4gKiBAdHlwZWRlZiB7SUhlYWRlcn0gSUhlYWRlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtDb250ZW50LVR5cGVdIFRoZSByZXF1ZXN0IGNvbnRlbnQgdHlwZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtBdXRob3JpemF0aW9uXSBBdXRob3JpemF0aW9uIGZvciB0aGUgcmVxdWVzdFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09wdGlvbnN9IE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbYmFzZVVybD1odHRwczovL2FwaS5wYXN0ZS5nZ10gVGhlIGJhc2UgVVJMIG9mIHRoZSBBUElcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbWFpblVybD1odHRwczovL3Bhc3RlLmdnXSBUaGUgVVJMIG9mIHRoZSBtYWluIHdlYnNpdGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbdmVyc2lvbj0xXSBUaGUgdmVyc2lvbiBvZiB0aGUgQVBJXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7UmVzdWx0fSBSZXN1bHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdXJsXSBUaGUgVVJMIGZvciB0aGUgcmVzdWx0XG4gKiBAcHJvcGVydHkge0F1dGhvcn0gW2F1dGhvcl0gVGhlIGF1dGhvciBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNyZWF0ZWRfYXQgVGhlIGRhdGUgdGhlIHBhc3RlIHdhcyBjcmVhdGVkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdXBkYXRlZF9hdCBUaGUgZGF0ZSB0aGUgcGFzdGUgd2FzIGxhc3QgdXBkYXRlZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtleHBpcmVzXSBUaGUgZGF0ZSB3aGVuIHRoZSBwYXN0ZSBleHBpcmVzXG4gKiBAcHJvcGVydHkge0ZpbGVbXX0gW2ZpbGVzXSBUaGUgZmlsZXMgdXNlZCBpbiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZWxldGlvbl9rZXldIFRoZSBkZWxldGlvbiBrZXkgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPdXRwdXR9IE91dHB1dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHN0YXR1cyBUaGUgb3V0cHV0IHN0YXR1c1xuICogQHByb3BlcnR5IHtSZXN1bHR9IFtyZXN1bHRdIFRoZSByZXN1bHQgZGF0YSBvYmplY3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXJyb3JdIFRoZSBlcnJvciBrZXlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbWVzc2FnZV0gVGhlIGVycm9yIG1lc3NhZ2VcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtQb3N0fSBQb3N0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBwYXN0ZSAobXVzdCBiZSBsZXNzIHRoYW4gMjUgS2lCKVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXhwaXJlc10gVGhlIGV4cGlyYXRpb24gZGF0ZSBvZiB0aGUgcGFzdGUgKG11c3QgYmUgYSBVVEMgSVNPIDg2MDEgc3RyaW5nKVxuICogQHByb3BlcnR5IHtGaWxlT3V0W119IGZpbGVzIEFycmF5IG9mIGZpbGVzIHRvIGFkZCB0byB0aGUgcGFzdGUgKGF0IGxlYXN0IG9uZSBmaWxlKVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0F1dGhvcn0gQXV0aG9yXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2lkXSBUaGUgSUQgb2YgdGhlIGF1dGhvclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFt1c2VybmFtZV0gVGhlIHVzZXJuYW1lIG9mIHRoZSBhdXRob3JcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGF1dGhvclxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1VwZGF0ZX0gVXBkYXRlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuZXcgbmFtZSBvZiB0aGUgcG9zdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc2NyaXB0aW9uIFRoZSBuZXcgZGVzY3JpcHRpb24gb2YgdGhlIHBvc3RcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtGaWxlfSBGaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmcgfCBudWxsfSBoaWdobGlnaHRfbGFuZ3VhZ2UgVGhlIHN5bnRheCBoaWdobGlnaHRpbmcgbGFuZ3VhZ2UgdXNlZFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge0NvbnRlbnR9IENvbnRlbnRcbiAqIEBwcm9wZXJ0eSB7dGV4dCB8IGJhc2U2NCB8IGd6aXAgfCB4en0gZm9ybWF0IFRoZSBmb3JtYXQgb2YgdGhlIGZpbGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaGlnaGxpZ2h0X2xhbmd1YWdlXSBUaGUgc3ludGF4IGhpZ2hsaWdodGluZyBsYW5ndWFnZSB0byB1c2VcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgb2YgdGhlIGZpbGUgY29udGVudHNcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtGaWxlT3V0fSBGaWxlT3V0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge0NvbnRlbnR9IGNvbnRlbnQgVGhlIGNvbnRlbnQgb2YgdGhlIGZpbGVcbiAqL1xuIl19