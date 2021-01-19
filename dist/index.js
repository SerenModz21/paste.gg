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
        version: 1
    }) {
        /** Auth key for paste.gg API */
        _auth.set(this, void 0);
        /** The full URL for the API */
        _url.set(this, void 0);
        __classPrivateFieldSet(this, _auth, auth);
        this.options = options;
        this.version = `v${require("../package.json").version}`;
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
/**
 * @typedef {Object}
 * @property {string} ["Content-Type"]
 * @property {string} [Authorization]
 */
/**
 * @interface PasteGGOptions
 * @interface PasteOutput
 * @interface PostPaste
 * @interface UpdatePost
 * @interface Files
 * @interface PostFiles
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQThCO0FBRzlCLE1BQU0sT0FBTztJQVVYOzs7Ozs7T0FNRztJQUNILFlBQW1CLElBQWEsRUFBRSxVQUEwQjtRQUMxRCxPQUFPLEVBQUUsc0JBQXNCO1FBQy9CLE9BQU8sRUFBRSxDQUFDO0tBQ1g7UUFuQkQsZ0NBQWdDO1FBQ2hDLHdCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0IsdUJBQXNCO1FBaUJwQix1QkFBQSxJQUFJLFNBQVMsSUFBSSxFQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4RCx1QkFBQSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFDO0lBQ2pFLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSyxPQUFPLENBQUMsSUFBYSxFQUFFLE9BQWlCO1FBQzlDLE1BQU0sT0FBTyxHQUFZLEVBQUUsQ0FBQTtRQUUzQjtZQUFnQixPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sbUNBQVUsRUFBRSxDQUFBO1FBQzNELElBQUksSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU07WUFBRSxPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUE7UUFDdkQsSUFBSSxPQUFPO1lBQUUsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLGtCQUFrQixDQUFBO1FBRXpELE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVUsRUFBRSxPQUFnQixLQUFLO1FBQ2hELE1BQU0sR0FBRyxHQUFHLE1BQU0sb0JBQUssQ0FBQyxHQUFHLGtDQUFTLFdBQVcsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFO1lBQ2hFLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUU7U0FDeEIsQ0FBQyxDQUFBO1FBRUYsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFnQjtRQUNoQyxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxrQ0FBUyxTQUFTLEVBQUU7WUFDN0MsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1lBQ2pDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztTQUM1QixDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFVLEVBQUUsR0FBWTtRQUMxQyxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxrQ0FBUyxXQUFXLEVBQUUsRUFBRSxFQUFFO1lBQ25ELE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztTQUMzQixDQUFDLENBQUE7UUFFRixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFVLEVBQUUsT0FBbUI7UUFDakQsSUFBSSxvQ0FBVztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUUvRSxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxrQ0FBUyxXQUFXLEVBQUUsRUFBRSxFQUFFO1lBQ25ELE1BQU0sRUFBRSxPQUFPO1lBQ2YsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNqQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7U0FDOUIsQ0FBQyxDQUFBO1FBRUYsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDbkIsQ0FBQztDQUNGO0FBR1EsMEJBQU87O0FBRGhCLGtCQUFlLE9BQU8sQ0FBQztBQUd2Qjs7OztHQUlHO0FBRUg7Ozs7Ozs7R0FPRyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgwqkgU2VyZW5Nb2R6MjEgMjAxOCAtIDIwMjEgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFVuYXV0aG9yaXplZCBkaXN0cmlidXRpb24gb2YgYW55IGNvZGUgd2l0aGluIHRoaXMgcHJvamVjdCBtYXkgcmVzdWx0IGluIGNvbnNlcXVlbmNlcyBjaG9zZW4gYnkgdGhlIEJvYXJkIE1lbWJlcnMuXG4gKiBSZWZlciB0byB0aGUgUkVBRE1FIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICovXG5cbmltcG9ydCBmZXRjaCBmcm9tIFwibm9kZS1mZXRjaFwiXG5pbXBvcnQgeyBQYXN0ZUdHT3B0aW9ucywgUGFzdGVPdXRwdXQsIFBvc3RQYXN0ZSwgSUhlYWRlciwgVXBkYXRlUG9zdCB9IGZyb20gXCIuL2ludGVyZmFjZXNcIlxuXG5jbGFzcyBQYXN0ZUdHIHtcbiAgLyoqIEF1dGgga2V5IGZvciBwYXN0ZS5nZyBBUEkgKi9cbiAgcmVhZG9ubHkgI2F1dGg6IHN0cmluZztcbiAgLyoqIFRoZSBmdWxsIFVSTCBmb3IgdGhlIEFQSSAqL1xuICByZWFkb25seSAjdXJsOiBzdHJpbmc7XG4gIC8qKiBUaGUgYmFzZSBVUkwgYW5kIEFQSSB2ZXJzaW9uIHVzZWQgKi9cbiAgcmVhZG9ubHkgb3B0aW9uczogUGFzdGVHR09wdGlvbnM7XG4gIC8qKiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBBUEkgd3JhcHBlciAqL1xuICByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBQYXN0ZUdHXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoIE9wdGlvbmFsIGF1dGgga2V5XG4gICAqIEBwYXJhbSB7UGFzdGVHR09wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgKiBAY2xhc3MgUGFzdGVHR1xuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoYXV0aD86IHN0cmluZywgb3B0aW9uczogUGFzdGVHR09wdGlvbnMgPSB7XG4gICAgYmFzZVVybDogXCJodHRwczovL2FwaS5wYXN0ZS5nZ1wiLFxuICAgIHZlcnNpb246IDFcbiAgfSkge1xuICAgIHRoaXMuI2F1dGggPSBhdXRoO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy52ZXJzaW9uID0gYHYke3JlcXVpcmUoXCIuLi9wYWNrYWdlLmpzb25cIikudmVyc2lvbn1gO1xuICAgIHRoaXMuI3VybCA9IGAke3RoaXMub3B0aW9ucy5iYXNlVXJsfS92JHt0aGlzLm9wdGlvbnMudmVyc2lvbn1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBoZWFkZXJzIHJlcXVpcmVkIGZvciB0aGUgcmVxdWVzdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXV0aFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbnRlbnRcbiAgICogQHJldHVybnMge0lIZWFkZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGhlYWRlcnMoYXV0aD86IHN0cmluZywgY29udGVudD86IGJvb2xlYW4pOiBJSGVhZGVyIHtcbiAgICBjb25zdCBoZWFkZXJzOiBJSGVhZGVyID0ge31cblxuICAgIGlmICh0aGlzLiNhdXRoKSBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgS2V5ICR7dGhpcy4jYXV0aH1gXG4gICAgaWYgKGF1dGg/Lmxlbmd0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke2F1dGh9YFxuICAgIGlmIChjb250ZW50KSBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCJcblxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBmdWxsIEluY2x1ZGVzIHRoZSBjb250ZW50cyBvZiBmaWxlcyBpZiB0cnVlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXN0ZU91dHB1dD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBnZXQoaWQ6IHN0cmluZywgZnVsbDogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxQYXN0ZU91dHB1dD4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzLyR7aWR9P2Z1bGw9JHtmdWxsfWAsIHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycygpXG4gICAgfSlcblxuICAgIHJldHVybiByZXMuanNvbigpXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHBhc3RlLlxuICAgKiBAcGFyYW0ge1Bvc3RQYXN0ZX0gaW5wdXQgVGhlIGluZm9ybWF0aW9uIHRvIGNyZWF0ZSB0aGUgcGFzdGUgd2l0aC5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGFzdGVPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcG9zdChpbnB1dDogUG9zdFBhc3RlKTogUHJvbWlzZTxQYXN0ZU91dHB1dD4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzYCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyhudWxsLCB0cnVlKSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGlucHV0KVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcy5qc29uKClcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZSB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBBdXRoIGtleSBvciBkZWxldGlvbiBrZXkgKGxlYXZlIGJsYW5rIGlmIHlvdSBoYXZlIHNldCB0aGUgYXV0aCBrZXkgaW4gdGhlIGNvbnN0cnVjdG9yKVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGVsZXRlKGlkOiBzdHJpbmcsIGtleT86IHN0cmluZyk6IFByb21pc2U8UGFzdGVPdXRwdXQgfCB2b2lkPiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dGhpcy4jdXJsfS9wYXN0ZXMvJHtpZH1gLCB7XG4gICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMoa2V5KVxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzLmpzb24oKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBmb3IgdGhlIHBhc3RlIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtVcGRhdGVQb3N0fSBvcHRpb25zIFRoZSBvcHRpb25zIHlvdSB3aXNoIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGFzdGVPdXRwdXQgfCB2b2lkPn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHVwZGF0ZShpZDogc3RyaW5nLCBvcHRpb25zOiBVcGRhdGVQb3N0KTogUHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuI2F1dGgpIHRocm93IG5ldyBFcnJvcihcIkFuIGF1dGgga2V5IGlzIHJlcXVpcmVkIGZvciB0aGlzIGVuZHBvaW50IVwiKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzLyR7aWR9YCwge1xuICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMobnVsbCwgdHJ1ZSksXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzLmpzb24oKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhc3RlR0c7XG5leHBvcnQgeyBQYXN0ZUdHIH07XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbXCJDb250ZW50LVR5cGVcIl1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbQXV0aG9yaXphdGlvbl1cbiAqL1xuXG4vKipcbiAqIEBpbnRlcmZhY2UgUGFzdGVHR09wdGlvbnNcbiAqIEBpbnRlcmZhY2UgUGFzdGVPdXRwdXRcbiAqIEBpbnRlcmZhY2UgUG9zdFBhc3RlXG4gKiBAaW50ZXJmYWNlIFVwZGF0ZVBvc3RcbiAqIEBpbnRlcmZhY2UgRmlsZXNcbiAqIEBpbnRlcmZhY2UgUG9zdEZpbGVzXG4gKi9cbiJdfQ==