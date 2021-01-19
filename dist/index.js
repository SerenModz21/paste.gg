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
     * @class {PasteGG}
     * @public
     * @package PasteGG
     */
    constructor(auth, options = {
        baseUrl: "https://api.paste.gg",
        version: 1
    }) {
        /** Auth key for paste.gg API */
        _auth.set(this, void 0);
        /** The full URL for the API */
        _url.set(this, void 0);
        __classPrivateFieldSet(this, _auth, auth);
        this.options = options;
        this.version = require("../package.json").version;
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
            headers: this.headers()
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
            body: JSON.stringify(input)
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
            headers: this.headers(key)
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
            body: JSON.stringify(options)
        });
        return res.json();
    }
}
exports.PasteGG = PasteGG;
_auth = new WeakMap(), _url = new WeakMap();
exports.default = PasteGG;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQThCO0FBRzlCLE1BQWEsT0FBTztJQVVsQjs7Ozs7OztPQU9HO0lBQ0gsWUFBbUIsSUFBYSxFQUFFLFVBQTBCO1FBQzFELE9BQU8sRUFBRSxzQkFBc0I7UUFDL0IsT0FBTyxFQUFFLENBQUM7S0FDWDtRQXBCRCxnQ0FBZ0M7UUFDaEMsd0JBQXVCO1FBQ3ZCLCtCQUErQjtRQUMvQix1QkFBc0I7UUFrQnBCLHVCQUFBLElBQUksU0FBUyxJQUFJLEVBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDbEQsdUJBQUEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssT0FBTyxDQUFDLElBQWEsRUFBRSxPQUFpQjtRQUM5QyxNQUFNLE9BQU8sR0FBWSxFQUFFLENBQUE7UUFFM0I7WUFBZ0IsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLG1DQUFVLEVBQUUsQ0FBQTtRQUMzRCxJQUFJLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNO1lBQUUsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFBO1FBQ3ZELElBQUksT0FBTztZQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxrQkFBa0IsQ0FBQTtRQUV6RCxPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFVLEVBQUUsT0FBZ0IsS0FBSztRQUNoRCxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxrQ0FBUyxXQUFXLEVBQUUsU0FBUyxJQUFJLEVBQUUsRUFBRTtZQUNoRSxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFO1NBQ3hCLENBQUMsQ0FBQTtRQUVGLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ25CLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBZ0I7UUFDaEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxvQkFBSyxDQUFDLEdBQUcsa0NBQVMsU0FBUyxFQUFFO1lBQzdDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNqQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBVSxFQUFFLEdBQVk7UUFDMUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxvQkFBSyxDQUFDLEdBQUcsa0NBQVMsV0FBVyxFQUFFLEVBQUUsRUFBRTtZQUNuRCxNQUFNLEVBQUUsUUFBUTtZQUNoQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7U0FDM0IsQ0FBQyxDQUFBO1FBRUYsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBVSxFQUFFLE9BQW1CO1FBQ2pELElBQUksb0NBQVc7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFFL0UsTUFBTSxHQUFHLEdBQUcsTUFBTSxvQkFBSyxDQUFDLEdBQUcsa0NBQVMsV0FBVyxFQUFFLEVBQUUsRUFBRTtZQUNuRCxNQUFNLEVBQUUsT0FBTztZQUNmLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7WUFDakMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1NBQzlCLENBQUMsQ0FBQTtRQUVGLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ25CLENBQUM7Q0FDRjtBQS9HRCwwQkErR0M7O0FBRUQsa0JBQWUsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCDCqSBTZXJlbk1vZHoyMSAyMDE4IC0gMjAyMSBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVW5hdXRob3JpemVkIGRpc3RyaWJ1dGlvbiBvZiBhbnkgY29kZSB3aXRoaW4gdGhpcyBwcm9qZWN0IG1heSByZXN1bHQgaW4gY29uc2VxdWVuY2VzIGNob3NlbiBieSB0aGUgQm9hcmQgTWVtYmVycy5cbiAqIFJlZmVyIHRvIHRoZSBSRUFETUUgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cblxuaW1wb3J0IGZldGNoIGZyb20gXCJub2RlLWZldGNoXCJcbmltcG9ydCB7IFBhc3RlR0dPcHRpb25zLCBQYXN0ZU91dHB1dCwgUG9zdFBhc3RlLCBJSGVhZGVyLCBVcGRhdGVQb3N0IH0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiXG5cbmV4cG9ydCBjbGFzcyBQYXN0ZUdHIHtcbiAgLyoqIEF1dGgga2V5IGZvciBwYXN0ZS5nZyBBUEkgKi9cbiAgcmVhZG9ubHkgI2F1dGg6IHN0cmluZztcbiAgLyoqIFRoZSBmdWxsIFVSTCBmb3IgdGhlIEFQSSAqL1xuICByZWFkb25seSAjdXJsOiBzdHJpbmc7XG4gIC8qKiBUaGUgYmFzZSBVUkwgYW5kIEFQSSB2ZXJzaW9uIHVzZWQgKi9cbiAgcmVhZG9ubHkgb3B0aW9uczogUGFzdGVHR09wdGlvbnM7XG4gIC8qKiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBBUEkgd3JhcHBlciAqL1xuICByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBQYXN0ZUdHXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoIE9wdGlvbmFsIGF1dGgga2V5XG4gICAqIEBwYXJhbSB7UGFzdGVHR09wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgKiBAY2xhc3Mge1Bhc3RlR0d9XG4gICAqIEBwdWJsaWNcbiAgICogQHBhY2thZ2UgUGFzdGVHR1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKGF1dGg/OiBzdHJpbmcsIG9wdGlvbnM6IFBhc3RlR0dPcHRpb25zID0ge1xuICAgIGJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkucGFzdGUuZ2dcIixcbiAgICB2ZXJzaW9uOiAxXG4gIH0pIHtcbiAgICB0aGlzLiNhdXRoID0gYXV0aDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMudmVyc2lvbiA9IHJlcXVpcmUoXCIuLi9wYWNrYWdlLmpzb25cIikudmVyc2lvbjtcbiAgICB0aGlzLiN1cmwgPSBgJHt0aGlzLm9wdGlvbnMuYmFzZVVybH0vdiR7dGhpcy5vcHRpb25zLnZlcnNpb259YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgaGVhZGVycyByZXF1aXJlZCBmb3IgdGhlIHJlcXVlc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1dGhcbiAgICogQHBhcmFtIHtib29sZWFufSBjb250ZW50XG4gICAqIEByZXR1cm5zIHtJSGVhZGVyfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBoZWFkZXJzKGF1dGg/OiBzdHJpbmcsIGNvbnRlbnQ/OiBib29sZWFuKTogSUhlYWRlciB7XG4gICAgY29uc3QgaGVhZGVyczogSUhlYWRlciA9IHt9XG5cbiAgICBpZiAodGhpcy4jYXV0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke3RoaXMuI2F1dGh9YFxuICAgIGlmIChhdXRoPy5sZW5ndGgpIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBLZXkgJHthdXRofWBcbiAgICBpZiAoY29udGVudCkgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiXG5cbiAgICByZXR1cm4gaGVhZGVyc1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgcGFzdGUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZnVsbCBJbmNsdWRlcyB0aGUgY29udGVudHMgb2YgZmlsZXMgaWYgdHJ1ZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGFzdGVPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZ2V0KGlkOiBzdHJpbmcsIGZ1bGw6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8UGFzdGVPdXRwdXQ+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLiN1cmx9L3Bhc3Rlcy8ke2lkfT9mdWxsPSR7ZnVsbH1gLCB7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMoKVxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzLmpzb24oKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBwYXN0ZS5cbiAgICogQHBhcmFtIHtQb3N0UGFzdGV9IGlucHV0IFRoZSBpbmZvcm1hdGlvbiB0byBjcmVhdGUgdGhlIHBhc3RlIHdpdGguXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBhc3RlT3V0cHV0Pn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHBvc3QoaW5wdXQ6IFBvc3RQYXN0ZSk6IFByb21pc2U8UGFzdGVPdXRwdXQ+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLiN1cmx9L3Bhc3Rlc2AsIHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMobnVsbCwgdHJ1ZSksXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShpbnB1dClcbiAgICB9KTtcblxuICAgIHJldHVybiByZXMuanNvbigpXG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBvZiB0aGUgcGFzdGUgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gQXV0aCBrZXkgb3IgZGVsZXRpb24ga2V5IChsZWF2ZSBibGFuayBpZiB5b3UgaGF2ZSBzZXQgdGhlIGF1dGgga2V5IGluIHRoZSBjb25zdHJ1Y3RvcilcbiAgICogQHJldHVybnMge1Byb21pc2U8UGFzdGVPdXRwdXQgfCB2b2lkPn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIGRlbGV0ZShpZDogc3RyaW5nLCBrZXk/OiBzdHJpbmcpOiBQcm9taXNlPFBhc3RlT3V0cHV0IHwgdm9pZD4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzLyR7aWR9YCwge1xuICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzKGtleSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlcy5qc29uKClcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgZm9yIHRoZSBwYXN0ZSB0byB1cGRhdGUuXG4gICAqIEBwYXJhbSB7VXBkYXRlUG9zdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyB5b3Ugd2lzaCB0byB1cGRhdGUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBhc3RlT3V0cHV0IHwgdm9pZD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyB1cGRhdGUoaWQ6IHN0cmluZywgb3B0aW9uczogVXBkYXRlUG9zdCk6IFByb21pc2U8UGFzdGVPdXRwdXQgfCB2b2lkPiB7XG4gICAgaWYgKCF0aGlzLiNhdXRoKSB0aHJvdyBuZXcgRXJyb3IoXCJBbiBhdXRoIGtleSBpcyByZXF1aXJlZCBmb3IgdGhpcyBlbmRwb2ludCFcIik7XG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLiN1cmx9L3Bhc3Rlcy8ke2lkfWAsIHtcbiAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzKG51bGwsIHRydWUpLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkob3B0aW9ucylcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlcy5qc29uKClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXN0ZUdHIl19