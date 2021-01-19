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
 * @property {string} [Content-Type] The request content type
 * @property {string} [Authorization] Authorization for the request
 */
/**
 * @typedef {PasteGGOptions} PasteGGOptions
 * @property {string} baseUrl The base URL of the API
 * @property {number} version The version of the API
 */
/**
 * @typedef {OutputResult} OutputResult
 * @property {string} id The ID of the created paste
 * @property {string} [name] The name of the created paste
 * @property {string} [description] The description of the created paste
 * @property {public | unlisted | private} [visibility=unlisted] The visibility of the created paste
 * @property {string} created_at The date the paste was created
 * @property {string} updated_at The date the paste was last updated
 * @property {string} [expires] The date when the paste expires
 * @property {Files[]} [files] The files used in the created paste
 * @property {string} [deletion_key] The deletion key of the created paste
 */
/**
 * @typedef {PasteOutput} PasteOutput
 * @property {string} status The output status
 * @property {OutputResult} [result] The result data object
 * @property {string} [error] The error key
 * @property {string} [message] The error message
 */
/**
 * @typedef {PostPaste} PostPaste
 * @property {string} [name] The name of the paste
 * @property {string} [description] The description of the paste (must be less than 25 KiB)
 * @property {public | unlisted | private} [visibility=unlisted] The visibility of the paste
 * @property {string} [expires] The expiration date of the paste (must be a UTC ISO 8601 string)
 * @property {PostFiles[]} files Array of files to add to the paste (at least one file)
 */
/**
 * @typedef {UpdatePost} UpdatePost
 * @property {string} [name] The new name of the post
 * @property {string} description The new description of the post
 */
/**
 * @typedef {Files} Files
 * @property {string} id The ID of the file
 * @property {string} name The name of the file
 * @property {string | null} highlight_language The syntax highlighting language used
 */
/**
 * @typedef {PostContent} PostContent
 * @property {text | base64 | gzip | xz} format The format of the file
 * @property {string} [highlight_language] The syntax highlighting language to use
 * @property {string} value The value of the file contents
 */
/**
 * @typedef {PostFiles} PostFiles
 * @property {string} [name] The name of the file
 * @property {PostContent} content The content of the file
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQStCO0FBYS9CLE1BQU0sT0FBTztJQVVYOzs7Ozs7T0FNRztJQUNILFlBQ0UsSUFBYSxFQUNiLFVBQTBCO1FBQ3hCLE9BQU8sRUFBRSxzQkFBc0I7UUFDL0IsT0FBTyxFQUFFLENBQUM7S0FDWDtRQXJCSCxnQ0FBZ0M7UUFDaEMsd0JBQXVCO1FBQ3ZCLCtCQUErQjtRQUMvQix1QkFBc0I7UUFvQnBCOzs7OztXQUtHO1FBQ0gsdUJBQUEsSUFBSSxTQUFTLElBQUksRUFBQztRQUNsQjs7Ozs7V0FLRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCOzs7OztXQUtHO1FBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hEOzs7OztXQUtHO1FBQ0gsdUJBQUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssT0FBTyxDQUFDLElBQWEsRUFBRSxPQUFpQjtRQUM5QyxNQUFNLE9BQU8sR0FBWSxFQUFFLENBQUM7UUFFNUI7WUFBZ0IsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLG1DQUFVLEVBQUUsQ0FBQztRQUM1RCxJQUFJLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNO1lBQUUsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hELElBQUksT0FBTztZQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztRQUUxRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFVLEVBQUUsT0FBZ0IsS0FBSztRQUNoRCxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxrQ0FBUyxXQUFXLEVBQUUsU0FBUyxJQUFJLEVBQUUsRUFBRTtZQUNoRSxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFO1NBQ3hCLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBZ0I7UUFDaEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxvQkFBSyxDQUFDLEdBQUcsa0NBQVMsU0FBUyxFQUFFO1lBQzdDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNqQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBVSxFQUFFLEdBQVk7UUFDMUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxvQkFBSyxDQUFDLEdBQUcsa0NBQVMsV0FBVyxFQUFFLEVBQUUsRUFBRTtZQUNuRCxNQUFNLEVBQUUsUUFBUTtZQUNoQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQ2pCLEVBQVUsRUFDVixPQUFtQjtRQUVuQixJQUFJLG9DQUFXO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBRWhFLE1BQU0sR0FBRyxHQUFHLE1BQU0sb0JBQUssQ0FBQyxHQUFHLGtDQUFTLFdBQVcsRUFBRSxFQUFFLEVBQUU7WUFDbkQsTUFBTSxFQUFFLE9BQU87WUFDZixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1lBQ2pDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUM5QixDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQixDQUFDO0NBQ0Y7QUFHUSwwQkFBTzs7QUFEaEIsa0JBQWUsT0FBTyxDQUFDO0FBR3ZCOzs7OztHQUtHO0FBRUg7Ozs7R0FJRztBQUVIOzs7Ozs7Ozs7OztHQVdHO0FBRUg7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7R0FPRztBQUVIOzs7O0dBSUc7QUFFSDs7Ozs7R0FLRztBQUVIOzs7OztHQUtHO0FBRUg7Ozs7R0FJRyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgwqkgU2VyZW5Nb2R6MjEgMjAxOCAtIDIwMjEgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFVuYXV0aG9yaXplZCBkaXN0cmlidXRpb24gb2YgYW55IGNvZGUgd2l0aGluIHRoaXMgcHJvamVjdCBtYXkgcmVzdWx0IGluIGNvbnNlcXVlbmNlcyBjaG9zZW4gYnkgdGhlIEJvYXJkIE1lbWJlcnMuXG4gKiBSZWZlciB0byB0aGUgUkVBRE1FIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICovXG5cbmltcG9ydCBmZXRjaCBmcm9tIFwibm9kZS1mZXRjaFwiO1xuaW1wb3J0IHtcbiAgUGFzdGVHR09wdGlvbnMsXG4gIFBhc3RlT3V0cHV0LFxuICBQb3N0UGFzdGUsXG4gIElIZWFkZXIsXG4gIFVwZGF0ZVBvc3QsXG4gIFBvc3RGaWxlcyxcbiAgRmlsZXMsXG4gIE91dHB1dFJlc3VsdCxcbiAgUG9zdENvbnRlbnQsXG59IGZyb20gXCIuL2ludGVyZmFjZXNcIjtcblxuY2xhc3MgUGFzdGVHRyB7XG4gIC8qKiBBdXRoIGtleSBmb3IgcGFzdGUuZ2cgQVBJICovXG4gIHJlYWRvbmx5ICNhdXRoOiBzdHJpbmc7XG4gIC8qKiBUaGUgZnVsbCBVUkwgZm9yIHRoZSBBUEkgKi9cbiAgcmVhZG9ubHkgI3VybDogc3RyaW5nO1xuICAvKiogVGhlIGJhc2UgVVJMIGFuZCBBUEkgdmVyc2lvbiB1c2VkICovXG4gIHJlYWRvbmx5IG9wdGlvbnM6IFBhc3RlR0dPcHRpb25zO1xuICAvKiogVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgQVBJIHdyYXBwZXIgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgUGFzdGVHR1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXV0aCBPcHRpb25hbCBhdXRoIGtleVxuICAgKiBAcGFyYW0ge1Bhc3RlR0dPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBwYXN0ZSBzZXJ2ZXJcbiAgICogQGNsYXNzIFBhc3RlR0dcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIGF1dGg/OiBzdHJpbmcsXG4gICAgb3B0aW9uczogUGFzdGVHR09wdGlvbnMgPSB7XG4gICAgICBiYXNlVXJsOiBcImh0dHBzOi8vYXBpLnBhc3RlLmdnXCIsXG4gICAgICB2ZXJzaW9uOiAxLFxuICAgIH1cbiAgKSB7XG4gICAgLyoqXG4gICAgICogVGhlIGF1dGgga2V5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuI2F1dGggPSBhdXRoO1xuICAgIC8qKlxuICAgICAqIFRoZSBvcHRpb25zIGZvciB0aGUgcGFzdGUgc2VydmVyXG4gICAgICogQHR5cGUge1Bhc3RlR0dPcHRpb25zfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBBUEkgd3JhcHBlclxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMudmVyc2lvbiA9IGB2JHtyZXF1aXJlKFwiLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259YDtcbiAgICAvKipcbiAgICAgKiBUaGUgZnVsbCBVUkwgZm9yIHRoZSBBUElcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy4jdXJsID0gYCR7dGhpcy5vcHRpb25zLmJhc2VVcmx9L3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufWA7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGhlYWRlcnMgcmVxdWlyZWQgZm9yIHRoZSByZXF1ZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29udGVudFxuICAgKiBAcmV0dXJucyB7SUhlYWRlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgaGVhZGVycyhhdXRoPzogc3RyaW5nLCBjb250ZW50PzogYm9vbGVhbik6IElIZWFkZXIge1xuICAgIGNvbnN0IGhlYWRlcnM6IElIZWFkZXIgPSB7fTtcblxuICAgIGlmICh0aGlzLiNhdXRoKSBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgS2V5ICR7dGhpcy4jYXV0aH1gO1xuICAgIGlmIChhdXRoPy5sZW5ndGgpIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBLZXkgJHthdXRofWA7XG4gICAgaWYgKGNvbnRlbnQpIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcblxuICAgIHJldHVybiBoZWFkZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgcGFzdGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZnVsbCBJbmNsdWRlcyB0aGUgY29udGVudHMgb2YgZmlsZXMgaWYgdHJ1ZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGFzdGVPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZ2V0KGlkOiBzdHJpbmcsIGZ1bGw6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8UGFzdGVPdXRwdXQ+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLiN1cmx9L3Bhc3Rlcy8ke2lkfT9mdWxsPSR7ZnVsbH1gLCB7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMoKSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBwYXN0ZS5cbiAgICogQHBhcmFtIHtQb3N0UGFzdGV9IGlucHV0IFRoZSBpbmZvcm1hdGlvbiB0byBjcmVhdGUgdGhlIHBhc3RlIHdpdGguXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBhc3RlT3V0cHV0Pn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHBvc3QoaW5wdXQ6IFBvc3RQYXN0ZSk6IFByb21pc2U8UGFzdGVPdXRwdXQ+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLiN1cmx9L3Bhc3Rlc2AsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMobnVsbCwgdHJ1ZSksXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShpbnB1dCksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZSB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBBdXRoIGtleSBvciBkZWxldGlvbiBrZXkgKGxlYXZlIGJsYW5rIGlmIHlvdSBoYXZlIHNldCB0aGUgYXV0aCBrZXkgaW4gdGhlIGNvbnN0cnVjdG9yKVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGVsZXRlKGlkOiBzdHJpbmcsIGtleT86IHN0cmluZyk6IFByb21pc2U8UGFzdGVPdXRwdXQgfCB2b2lkPiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dGhpcy4jdXJsfS9wYXN0ZXMvJHtpZH1gLCB7XG4gICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMoa2V5KSxcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuanNvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBmb3IgdGhlIHBhc3RlIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtVcGRhdGVQb3N0fSBvcHRpb25zIFRoZSBvcHRpb25zIHlvdSB3aXNoIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGFzdGVPdXRwdXQgfCB2b2lkPn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHVwZGF0ZShcbiAgICBpZDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IFVwZGF0ZVBvc3RcbiAgKTogUHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuI2F1dGgpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbiBhdXRoIGtleSBpcyByZXF1aXJlZCBmb3IgdGhpcyBlbmRwb2ludCFcIik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLiN1cmx9L3Bhc3Rlcy8ke2lkfWAsIHtcbiAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzKG51bGwsIHRydWUpLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkob3B0aW9ucyksXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXN0ZUdHO1xuZXhwb3J0IHsgUGFzdGVHRyB9O1xuXG4vKipcbiAqIFRoZSBoZWFkZXIgb3B0aW9uc1xuICogQHR5cGVkZWYge0lIZWFkZXJ9IElIZWFkZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbQ29udGVudC1UeXBlXSBUaGUgcmVxdWVzdCBjb250ZW50IHR5cGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbQXV0aG9yaXphdGlvbl0gQXV0aG9yaXphdGlvbiBmb3IgdGhlIHJlcXVlc3RcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtQYXN0ZUdHT3B0aW9uc30gUGFzdGVHR09wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBiYXNlVXJsIFRoZSBiYXNlIFVSTCBvZiB0aGUgQVBJXG4gKiBAcHJvcGVydHkge251bWJlcn0gdmVyc2lvbiBUaGUgdmVyc2lvbiBvZiB0aGUgQVBJXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T3V0cHV0UmVzdWx0fSBPdXRwdXRSZXN1bHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbmFtZV0gVGhlIG5hbWUgb2YgdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgY3JlYXRlZCBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGNyZWF0ZWRfYXQgVGhlIGRhdGUgdGhlIHBhc3RlIHdhcyBjcmVhdGVkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdXBkYXRlZF9hdCBUaGUgZGF0ZSB0aGUgcGFzdGUgd2FzIGxhc3QgdXBkYXRlZFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtleHBpcmVzXSBUaGUgZGF0ZSB3aGVuIHRoZSBwYXN0ZSBleHBpcmVzXG4gKiBAcHJvcGVydHkge0ZpbGVzW119IFtmaWxlc10gVGhlIGZpbGVzIHVzZWQgaW4gdGhlIGNyZWF0ZWQgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZGVsZXRpb25fa2V5XSBUaGUgZGVsZXRpb24ga2V5IG9mIHRoZSBjcmVhdGVkIHBhc3RlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7UGFzdGVPdXRwdXR9IFBhc3RlT3V0cHV0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gc3RhdHVzIFRoZSBvdXRwdXQgc3RhdHVzXG4gKiBAcHJvcGVydHkge091dHB1dFJlc3VsdH0gW3Jlc3VsdF0gVGhlIHJlc3VsdCBkYXRhIG9iamVjdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtlcnJvcl0gVGhlIGVycm9yIGtleVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFttZXNzYWdlXSBUaGUgZXJyb3IgbWVzc2FnZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1Bvc3RQYXN0ZX0gUG9zdFBhc3RlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBwYXN0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBwYXN0ZSAobXVzdCBiZSBsZXNzIHRoYW4gMjUgS2lCKVxuICogQHByb3BlcnR5IHtwdWJsaWMgfCB1bmxpc3RlZCB8IHByaXZhdGV9IFt2aXNpYmlsaXR5PXVubGlzdGVkXSBUaGUgdmlzaWJpbGl0eSBvZiB0aGUgcGFzdGVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZXhwaXJlc10gVGhlIGV4cGlyYXRpb24gZGF0ZSBvZiB0aGUgcGFzdGUgKG11c3QgYmUgYSBVVEMgSVNPIDg2MDEgc3RyaW5nKVxuICogQHByb3BlcnR5IHtQb3N0RmlsZXNbXX0gZmlsZXMgQXJyYXkgb2YgZmlsZXMgdG8gYWRkIHRvIHRoZSBwYXN0ZSAoYXQgbGVhc3Qgb25lIGZpbGUpXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7VXBkYXRlUG9zdH0gVXBkYXRlUG9zdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtuYW1lXSBUaGUgbmV3IG5hbWUgb2YgdGhlIHBvc3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBUaGUgbmV3IGRlc2NyaXB0aW9uIG9mIHRoZSBwb3N0XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7RmlsZXN9IEZpbGVzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmcgfCBudWxsfSBoaWdobGlnaHRfbGFuZ3VhZ2UgVGhlIHN5bnRheCBoaWdobGlnaHRpbmcgbGFuZ3VhZ2UgdXNlZFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1Bvc3RDb250ZW50fSBQb3N0Q29udGVudFxuICogQHByb3BlcnR5IHt0ZXh0IHwgYmFzZTY0IHwgZ3ppcCB8IHh6fSBmb3JtYXQgVGhlIGZvcm1hdCBvZiB0aGUgZmlsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtoaWdobGlnaHRfbGFuZ3VhZ2VdIFRoZSBzeW50YXggaGlnaGxpZ2h0aW5nIGxhbmd1YWdlIHRvIHVzZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHZhbHVlIFRoZSB2YWx1ZSBvZiB0aGUgZmlsZSBjb250ZW50c1xuICovXG5cbi8qKlxuICogQHR5cGVkZWYge1Bvc3RGaWxlc30gUG9zdEZpbGVzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW25hbWVdIFRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gKiBAcHJvcGVydHkge1Bvc3RDb250ZW50fSBjb250ZW50IFRoZSBjb250ZW50IG9mIHRoZSBmaWxlXG4gKi9cbiJdfQ==