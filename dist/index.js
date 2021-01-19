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
exports.default = PasteGG;
exports.PasteGG = PasteGG;
_auth = new WeakMap(), _url = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQThCO0FBRzlCLE1BQXFCLE9BQU87SUFVMUI7Ozs7O09BS0c7SUFDSCxZQUFZLElBQWEsRUFBRSxVQUEwQjtRQUNuRCxPQUFPLEVBQUUsc0JBQXNCO1FBQy9CLE9BQU8sRUFBRSxDQUFDO0tBQ1g7UUFsQkQsZ0NBQWdDO1FBQ2hDLHdCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0IsdUJBQXNCO1FBZ0JwQix1QkFBQSxJQUFJLFNBQVMsSUFBSSxFQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2xELHVCQUFBLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUM7SUFDakUsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLE9BQU8sQ0FBQyxJQUFhLEVBQUUsT0FBaUI7UUFDOUMsTUFBTSxPQUFPLEdBQVksRUFBRSxDQUFBO1FBRTNCO1lBQWdCLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxtQ0FBVSxFQUFFLENBQUE7UUFDM0QsSUFBSSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTTtZQUFFLE9BQU8sQ0FBQyxhQUFhLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQTtRQUN2RCxJQUFJLE9BQU87WUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsa0JBQWtCLENBQUE7UUFFekQsT0FBTyxPQUFPLENBQUE7SUFDaEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBVSxFQUFFLE9BQWdCLEtBQUs7UUFDaEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxvQkFBSyxDQUFDLEdBQUcsa0NBQVMsV0FBVyxFQUFFLFNBQVMsSUFBSSxFQUFFLEVBQUU7WUFDaEUsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtTQUN4QixDQUFDLENBQUE7UUFFRixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQWdCO1FBQ2hDLE1BQU0sR0FBRyxHQUFHLE1BQU0sb0JBQUssQ0FBQyxHQUFHLGtDQUFTLFNBQVMsRUFBRTtZQUM3QyxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7WUFDakMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1NBQzVCLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ25CLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQVUsRUFBRSxHQUFZO1FBQzFDLE1BQU0sR0FBRyxHQUFHLE1BQU0sb0JBQUssQ0FBQyxHQUFHLGtDQUFTLFdBQVcsRUFBRSxFQUFFLEVBQUU7WUFDbkQsTUFBTSxFQUFFLFFBQVE7WUFDaEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1NBQzNCLENBQUMsQ0FBQTtRQUVGLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ25CLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQVUsRUFBRSxPQUFtQjtRQUNqRCxJQUFJLG9DQUFXO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1FBRS9FLE1BQU0sR0FBRyxHQUFHLE1BQU0sb0JBQUssQ0FBQyxHQUFHLGtDQUFTLFdBQVcsRUFBRSxFQUFFLEVBQUU7WUFDbkQsTUFBTSxFQUFFLE9BQU87WUFDZixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1lBQ2pDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUM5QixDQUFDLENBQUE7UUFFRixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0NBQ0Y7QUE3R0QsMEJBNkdDO0FBRVEsMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IMKpIFNlcmVuTW9kejIxIDIwMTggLSAyMDIxIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBVbmF1dGhvcml6ZWQgZGlzdHJpYnV0aW9uIG9mIGFueSBjb2RlIHdpdGhpbiB0aGlzIHByb2plY3QgbWF5IHJlc3VsdCBpbiBjb25zZXF1ZW5jZXMgY2hvc2VuIGJ5IHRoZSBCb2FyZCBNZW1iZXJzLlxuICogUmVmZXIgdG8gdGhlIFJFQURNRSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuXG5pbXBvcnQgZmV0Y2ggZnJvbSBcIm5vZGUtZmV0Y2hcIlxuaW1wb3J0IHsgUGFzdGVHR09wdGlvbnMsIFBhc3RlT3V0cHV0LCBQb3N0UGFzdGUsIElIZWFkZXIsIFVwZGF0ZVBvc3QgfSBmcm9tIFwiLi9pbnRlcmZhY2VzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFzdGVHRyB7XG4gIC8qKiBBdXRoIGtleSBmb3IgcGFzdGUuZ2cgQVBJICovXG4gIHJlYWRvbmx5ICNhdXRoOiBzdHJpbmc7XG4gIC8qKiBUaGUgZnVsbCBVUkwgZm9yIHRoZSBBUEkgKi9cbiAgcmVhZG9ubHkgI3VybDogc3RyaW5nO1xuICAvKiogVGhlIGJhc2UgVVJMIGFuZCBBUEkgdmVyc2lvbiB1c2VkICovXG4gIHJlYWRvbmx5IG9wdGlvbnM6IFBhc3RlR0dPcHRpb25zO1xuICAvKiogVGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgQVBJIHdyYXBwZXIgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgUGFzdGVHR1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXV0aCBPcHRpb25hbCBhdXRoIGtleVxuICAgKiBAcGFyYW0ge1Bhc3RlR0dPcHRpb25zfSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBwYXN0ZSBzZXJ2ZXJcbiAgICogQGNsYXNzIHtQYXN0ZUdHfVxuICAgKi9cbiAgY29uc3RydWN0b3IoYXV0aD86IHN0cmluZywgb3B0aW9uczogUGFzdGVHR09wdGlvbnMgPSB7XG4gICAgYmFzZVVybDogXCJodHRwczovL2FwaS5wYXN0ZS5nZ1wiLFxuICAgIHZlcnNpb246IDFcbiAgfSkge1xuICAgIHRoaXMuI2F1dGggPSBhdXRoO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy52ZXJzaW9uID0gcmVxdWlyZShcIi4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9uO1xuICAgIHRoaXMuI3VybCA9IGAke3RoaXMub3B0aW9ucy5iYXNlVXJsfS92JHt0aGlzLm9wdGlvbnMudmVyc2lvbn1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBoZWFkZXJzIHJlcXVpcmVkIGZvciB0aGUgcmVxdWVzdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXV0aFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbnRlbnRcbiAgICogQHJldHVybnMge0lIZWFkZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGhlYWRlcnMoYXV0aD86IHN0cmluZywgY29udGVudD86IGJvb2xlYW4pOiBJSGVhZGVyIHtcbiAgICBjb25zdCBoZWFkZXJzOiBJSGVhZGVyID0ge31cblxuICAgIGlmICh0aGlzLiNhdXRoKSBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgS2V5ICR7dGhpcy4jYXV0aH1gXG4gICAgaWYgKGF1dGg/Lmxlbmd0aCkgaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEtleSAke2F1dGh9YFxuICAgIGlmIChjb250ZW50KSBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCJcblxuICAgIHJldHVybiBoZWFkZXJzXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBmdWxsIEluY2x1ZGVzIHRoZSBjb250ZW50cyBvZiBmaWxlcyBpZiB0cnVlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXN0ZU91dHB1dD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBnZXQoaWQ6IHN0cmluZywgZnVsbDogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxQYXN0ZU91dHB1dD4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzLyR7aWR9P2Z1bGw9JHtmdWxsfWAsIHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycygpXG4gICAgfSlcblxuICAgIHJldHVybiByZXMuanNvbigpXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHBhc3RlLlxuICAgKiBAcGFyYW0ge1Bvc3RQYXN0ZX0gaW5wdXQgVGhlIGluZm9ybWF0aW9uIHRvIGNyZWF0ZSB0aGUgcGFzdGUgd2l0aC5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGFzdGVPdXRwdXQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgcG9zdChpbnB1dDogUG9zdFBhc3RlKTogUHJvbWlzZTxQYXN0ZU91dHB1dD4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzYCwge1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyhudWxsLCB0cnVlKSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGlucHV0KVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlcy5qc29uKClcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIG9mIHRoZSBwYXN0ZSB0byBkZWxldGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBBdXRoIGtleSBvciBkZWxldGlvbiBrZXkgKGxlYXZlIGJsYW5rIGlmIHlvdSBoYXZlIHNldCB0aGUgYXV0aCBrZXkgaW4gdGhlIGNvbnN0cnVjdG9yKVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGVsZXRlKGlkOiBzdHJpbmcsIGtleT86IHN0cmluZyk6IFByb21pc2U8UGFzdGVPdXRwdXQgfCB2b2lkPiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dGhpcy4jdXJsfS9wYXN0ZXMvJHtpZH1gLCB7XG4gICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMoa2V5KVxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzLmpzb24oKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhbiBleGlzdGluZyBwYXN0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBJRCBmb3IgdGhlIHBhc3RlIHRvIHVwZGF0ZS5cbiAgICogQHBhcmFtIHtVcGRhdGVQb3N0fSBvcHRpb25zIFRoZSBvcHRpb25zIHlvdSB3aXNoIHRvIHVwZGF0ZS5cbiAgICogQHJldHVybnMge1Byb21pc2U8UGFzdGVPdXRwdXQgfCB2b2lkPn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIHVwZGF0ZShpZDogc3RyaW5nLCBvcHRpb25zOiBVcGRhdGVQb3N0KTogUHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuI2F1dGgpIHRocm93IG5ldyBFcnJvcihcIkFuIGF1dGgga2V5IGlzIHJlcXVpcmVkIGZvciB0aGlzIGVuZHBvaW50IVwiKTtcblxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGAke3RoaXMuI3VybH0vcGFzdGVzLyR7aWR9YCwge1xuICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMobnVsbCwgdHJ1ZSksXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcHRpb25zKVxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzLmpzb24oKVxuICB9XG59XG5cbmV4cG9ydCB7IFBhc3RlR0cgfSJdfQ==