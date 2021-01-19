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
class PasteGG {
    /**
     * Create a new instance of PasteGG
     * @param {string} auth Optional auth key
     * @param {PasteGGOptions} options Options for the paste server
     * @class PasteGG
     * @public
     */
    constructor(auth, options = {
        baseUrl: "https://api.paste.gg",
        version: 1,
    }) {
        /** Auth key for paste.gg API */
        _auth.set(this, void 0);
        /** The full URL for the API */
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
         * @type {PasteGGOptions}
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
     * The headers required for the request
     * @param {string} auth
     * @param {boolean} content
     * @returns {IHeader}
     * @private
     */
    headers(auth, content) {
        const headers = {};
        if (__classPrivateFieldGet(this, _auth))
            headers.Authorization = `Key ${__classPrivateFieldGet(this, _auth)}`;
        if (auth === null || auth === void 0 ? void 0 : auth.length)
            headers.Authorization = `Key ${auth}`;
        if (content)
            headers["Content-Type"] = "application/json";
        return headers;
    }
    /**
     * Get an existing paste.
     * @param {string} id The ID of the paste.
     * @param {boolean} full Includes the contents of files if true.
     * @returns {Promise<PasteOutput>}
     * @public
     */
    async get(id, full = false) {
        const res = await node_fetch_1.default(`${__classPrivateFieldGet(this, _url)}/pastes/${id}?full=${full}`, {
            method: "GET",
            headers: this.headers(),
        });
        return res.json();
    }
    /**
     * Create a new paste.
     * @param {PostPaste} input The information to create the paste with.
     * @returns {Promise<PasteOutput>}
     * @public
     */
    async post(input) {
        const res = await node_fetch_1.default(`${__classPrivateFieldGet(this, _url)}/pastes`, {
            method: "POST",
            headers: this.headers(null, true),
            body: JSON.stringify(input),
        });
        return res.json();
    }
    /**
     * Deletes an existing paste.
     * @param {string} id The ID of the paste to delete.
     * @param {string} [key] Auth key or deletion key (leave blank if you have set the auth key in the constructor)
     * @returns {Promise<PasteOutput | void>}
     * @public
     */
    async delete(id, key) {
        const res = await node_fetch_1.default(`${__classPrivateFieldGet(this, _url)}/pastes/${id}`, {
            method: "DELETE",
            headers: this.headers(key),
        });
        return res.json();
    }
    /**
     * Update an existing paste.
     * @param {string} id The ID for the paste to update.
     * @param {UpdatePost} options The options you wish to update.
     * @returns {Promise<PasteOutput | void>}
     * @public
     */
    async update(id, options) {
        if (!__classPrivateFieldGet(this, _auth))
            throw new Error("An auth key is required for this endpoint!");
        const res = await node_fetch_1.default(`${__classPrivateFieldGet(this, _url)}/pastes/${id}`, {
            method: "PATCH",
            headers: this.headers(null, true),
            body: JSON.stringify(options),
        });
        return res.json();
    }
}
exports.PasteGG = PasteGG;
_auth = new WeakMap(), _url = new WeakMap();
exports.default = PasteGG;
/**
 * The header options
 * @typedef {IHeader} IHeader
 * @property {string} [Content-Type]
 * @property {string} [Authorization]
 */
/**
 * @typedef {PasteGGOptions} PasteGGOptions
 * @property {string} baseUrl
 * @property {number} version
 */
/**
 * @typedef {PasteOutput} PasteOutput
 * @property {string} status
 * @property {PasteOutput.result} [result]
 * @property {string} [error]
 * @property {string} [message]
 */
/**
 * @typedef {PostPaste} PostPaste
 * @property {string} [name]
 * @property {string} [description]
 * @property {public | unlisted | private} [visibility]
 * @property {string} [expires]
 * @property {PostFiles[]} files
 */
/**
 * @typedef {UpdatePost} UpdatePost
 * @property {string} [name]
 * @property {string} description
 */
/**
 * @typedef {Files} Files
 * @property {string} id
 * @property {string} name
 * @property {string | null} highlight_language
 */
/**
 * @typedef {PostFiles} PostFiles
 * @property {string} [name]
 * @property {PostFiles.content} content
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQStCO0FBVy9CLE1BQU0sT0FBTztJQVVYOzs7Ozs7T0FNRztJQUNILFlBQ0UsSUFBYSxFQUNiLFVBQTBCO1FBQ3hCLE9BQU8sRUFBRSxzQkFBc0I7UUFDL0IsT0FBTyxFQUFFLENBQUM7S0FDWDtRQXJCSCxnQ0FBZ0M7UUFDaEMsd0JBQXVCO1FBQ3ZCLCtCQUErQjtRQUMvQix1QkFBc0I7UUFvQnBCOzs7OztXQUtHO1FBQ0gsdUJBQUEsSUFBSSxTQUFTLElBQUksRUFBQztRQUNsQjs7Ozs7V0FLRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCOzs7OztXQUtHO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hEOzs7OztXQUtHO1FBQ0gsdUJBQUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssT0FBTyxDQUFDLElBQWEsRUFBRSxPQUFpQjtRQUM5QyxNQUFNLE9BQU8sR0FBWSxFQUFFLENBQUM7UUFFNUI7WUFBZ0IsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLG1DQUFVLEVBQUUsQ0FBQztRQUM1RCxJQUFJLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNO1lBQUUsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hELElBQUksT0FBTztZQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztRQUUxRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFVLEVBQUUsT0FBZ0IsS0FBSztRQUNoRCxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxrQ0FBUyxXQUFXLEVBQUUsU0FBUyxJQUFJLEVBQUUsRUFBRTtZQUNoRSxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFO1NBQ3hCLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBZ0I7UUFDaEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxvQkFBSyxDQUFDLEdBQUcsa0NBQVMsU0FBUyxFQUFFO1lBQzdDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNqQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBVSxFQUFFLEdBQVk7UUFDMUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxvQkFBSyxDQUFDLEdBQUcsa0NBQVMsV0FBVyxFQUFFLEVBQUUsRUFBRTtZQUNuRCxNQUFNLEVBQUUsUUFBUTtZQUNoQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQ2pCLEVBQVUsRUFDVixPQUFtQjtRQUVuQixJQUFJLG9DQUFXO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBRWhFLE1BQU0sR0FBRyxHQUFHLE1BQU0sb0JBQUssQ0FBQyxHQUFHLGtDQUFTLFdBQVcsRUFBRSxFQUFFLEVBQUU7WUFDbkQsTUFBTSxFQUFFLE9BQU87WUFDZixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1lBQ2pDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUM5QixDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQixDQUFDO0NBQ0Y7QUFHUSwwQkFBTzs7QUFEaEIsa0JBQWUsT0FBTyxDQUFDO0FBR3ZCOzs7OztHQUtHO0FBRUg7Ozs7R0FJRztBQUVIOzs7Ozs7R0FNRztBQUVIOzs7Ozs7O0dBT0c7QUFFSDs7OztHQUlHO0FBRUg7Ozs7O0dBS0c7QUFFSDs7OztHQUlHIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCDCqSBTZXJlbk1vZHoyMSAyMDE4IC0gMjAyMSBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVW5hdXRob3JpemVkIGRpc3RyaWJ1dGlvbiBvZiBhbnkgY29kZSB3aXRoaW4gdGhpcyBwcm9qZWN0IG1heSByZXN1bHQgaW4gY29uc2VxdWVuY2VzIGNob3NlbiBieSB0aGUgQm9hcmQgTWVtYmVycy5cbiAqIFJlZmVyIHRvIHRoZSBSRUFETUUgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cblxuaW1wb3J0IGZldGNoIGZyb20gXCJub2RlLWZldGNoXCI7XG5pbXBvcnQge1xuICBQYXN0ZUdHT3B0aW9ucyxcbiAgUGFzdGVPdXRwdXQsXG4gIFBvc3RQYXN0ZSxcbiAgSUhlYWRlcixcbiAgVXBkYXRlUG9zdCxcbiAgUG9zdEZpbGVzLFxuICBGaWxlcyxcbn0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuXG5jbGFzcyBQYXN0ZUdHIHtcbiAgLyoqIEF1dGgga2V5IGZvciBwYXN0ZS5nZyBBUEkgKi9cbiAgcmVhZG9ubHkgI2F1dGg6IHN0cmluZztcbiAgLyoqIFRoZSBmdWxsIFVSTCBmb3IgdGhlIEFQSSAqL1xuICByZWFkb25seSAjdXJsOiBzdHJpbmc7XG4gIC8qKiBUaGUgYmFzZSBVUkwgYW5kIEFQSSB2ZXJzaW9uIHVzZWQgKi9cbiAgcmVhZG9ubHkgb3B0aW9uczogUGFzdGVHR09wdGlvbnM7XG4gIC8qKiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBBUEkgd3JhcHBlciAqL1xuICByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBQYXN0ZUdHXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoIE9wdGlvbmFsIGF1dGgga2V5XG4gICAqIEBwYXJhbSB7UGFzdGVHR09wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgKiBAY2xhc3MgUGFzdGVHR1xuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgYXV0aD86IHN0cmluZyxcbiAgICBvcHRpb25zOiBQYXN0ZUdHT3B0aW9ucyA9IHtcbiAgICAgIGJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkucGFzdGUuZ2dcIixcbiAgICAgIHZlcnNpb246IDEsXG4gICAgfVxuICApIHtcbiAgICAvKipcbiAgICAgKiBUaGUgYXV0aCBrZXlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy4jYXV0aCA9IGF1dGg7XG4gICAgLyoqXG4gICAgICogVGhlIG9wdGlvbnMgZm9yIHRoZSBwYXN0ZSBzZXJ2ZXJcbiAgICAgKiBAdHlwZSB7UGFzdGVHR09wdGlvbnN9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgLyoqXG4gICAgICogVGhlIHZlcnNpb24gb2YgdGhlIEFQSSB3cmFwcGVyXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy52ZXJzaW9uID0gYHYke3JlcXVpcmUoXCIuLi9wYWNrYWdlLmpzb25cIikudmVyc2lvbn1gO1xuICAgIC8qKlxuICAgICAqIFRoZSBmdWxsIFVSTCBmb3IgdGhlIEFQSVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLiN1cmwgPSBgJHt0aGlzLm9wdGlvbnMuYmFzZVVybH0vdiR7dGhpcy5vcHRpb25zLnZlcnNpb259YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaGVhZGVycyByZXF1aXJlZCBmb3IgdGhlIHJlcXVlc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1dGhcbiAgICogQHBhcmFtIHtib29sZWFufSBjb250ZW50XG4gICAqIEByZXR1cm5zIHtJSGVhZGVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBoZWFkZXJzKGF1dGg/OiBzdHJpbmcsIGNvbnRlbnQ/OiBib29sZWFuKTogSUhlYWRlciB7XG4gICAgY29uc3QgaGVhZGVyczogSUhlYWRlciA9IHt9O1xuXG4gICAgaWYgKHRoaXMuI2F1dGgpIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBLZXkgJHt0aGlzLiNhdXRofWA7XG4gICAgaWYgKGF1dGg/Lmxlbmd0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke2F1dGh9YDtcbiAgICBpZiAoY29udGVudCkgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiO1xuXG4gICAgcmV0dXJuIGhlYWRlcnM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBmdWxsIEluY2x1ZGVzIHRoZSBjb250ZW50cyBvZiBmaWxlcyBpZiB0cnVlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXN0ZU91dHB1dD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBnZXQoaWQ6IHN0cmluZywgZnVsbDogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxQYXN0ZU91dHB1dD4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzLyR7aWR9P2Z1bGw9JHtmdWxsfWAsIHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycygpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHBhc3RlLlxuICAgKiBAcGFyYW0ge1Bvc3RQYXN0ZX0gaW5wdXQgVGhlIGluZm9ybWF0aW9uIHRvIGNyZWF0ZSB0aGUgcGFzdGUgd2l0aC5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGFzdGVPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcG9zdChpbnB1dDogUG9zdFBhc3RlKTogUHJvbWlzZTxQYXN0ZU91dHB1dD4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzYCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyhudWxsLCB0cnVlKSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGlucHV0KSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIHBhc3RlIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIEF1dGgga2V5IG9yIGRlbGV0aW9uIGtleSAobGVhdmUgYmxhbmsgaWYgeW91IGhhdmUgc2V0IHRoZSBhdXRoIGtleSBpbiB0aGUgY29uc3RydWN0b3IpXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBhc3RlT3V0cHV0IHwgdm9pZD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBkZWxldGUoaWQ6IHN0cmluZywga2V5Pzogc3RyaW5nKTogUHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLiN1cmx9L3Bhc3Rlcy8ke2lkfWAsIHtcbiAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyhrZXkpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIGZvciB0aGUgcGFzdGUgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge1VwZGF0ZVBvc3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgeW91IHdpc2ggdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgdXBkYXRlKFxuICAgIGlkOiBzdHJpbmcsXG4gICAgb3B0aW9uczogVXBkYXRlUG9zdFxuICApOiBQcm9taXNlPFBhc3RlT3V0cHV0IHwgdm9pZD4ge1xuICAgIGlmICghdGhpcy4jYXV0aClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGF1dGgga2V5IGlzIHJlcXVpcmVkIGZvciB0aGlzIGVuZHBvaW50IVwiKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzLyR7aWR9YCwge1xuICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMobnVsbCwgdHJ1ZSksXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcHRpb25zKSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuanNvbigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhc3RlR0c7XG5leHBvcnQgeyBQYXN0ZUdHIH07XG5cbi8qKlxuICogVGhlIGhlYWRlciBvcHRpb25zXG4gKiBAdHlwZWRlZiB7SUhlYWRlcn0gSUhlYWRlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtDb250ZW50LVR5cGVdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW0F1dGhvcml6YXRpb25dXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7UGFzdGVHR09wdGlvbnN9IFBhc3RlR0dPcHRpb25zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYmFzZVVybFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHZlcnNpb25cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtQYXN0ZU91dHB1dH0gUGFzdGVPdXRwdXRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzdGF0dXNcbiAqIEBwcm9wZXJ0eSB7UGFzdGVPdXRwdXQucmVzdWx0fSBbcmVzdWx0XVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtlcnJvcl1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbWVzc2FnZV1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtQb3N0UGFzdGV9IFBvc3RQYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZXNjcmlwdGlvbl1cbiAqIEBwcm9wZXJ0eSB7cHVibGljIHwgdW5saXN0ZWQgfCBwcml2YXRlfSBbdmlzaWJpbGl0eV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXhwaXJlc11cbiAqIEBwcm9wZXJ0eSB7UG9zdEZpbGVzW119IGZpbGVzXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7VXBkYXRlUG9zdH0gVXBkYXRlUG9zdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7RmlsZXN9IEZpbGVzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IG51bGx9IGhpZ2hsaWdodF9sYW5ndWFnZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1Bvc3RGaWxlc30gUG9zdEZpbGVzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdXG4gKiBAcHJvcGVydHkge1Bvc3RGaWxlcy5jb250ZW50fSBjb250ZW50XG4gKi9cbiJdfQ==