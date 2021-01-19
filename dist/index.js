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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsNERBQThCO0FBRzlCLE1BQU0sT0FBTztJQVVYOzs7Ozs7T0FNRztJQUNILFlBQW1CLElBQWEsRUFBRSxVQUEwQjtRQUMxRCxPQUFPLEVBQUUsc0JBQXNCO1FBQy9CLE9BQU8sRUFBRSxDQUFDO0tBQ1g7UUFuQkQsZ0NBQWdDO1FBQ2hDLHdCQUF1QjtRQUN2QiwrQkFBK0I7UUFDL0IsdUJBQXNCO1FBaUJwQix1QkFBQSxJQUFJLFNBQVMsSUFBSSxFQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4RCx1QkFBQSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFDO0lBQ2pFLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSyxPQUFPLENBQUMsSUFBYSxFQUFFLE9BQWlCO1FBQzlDLE1BQU0sT0FBTyxHQUFZLEVBQUUsQ0FBQTtRQUUzQjtZQUFnQixPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sbUNBQVUsRUFBRSxDQUFBO1FBQzNELElBQUksSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU07WUFBRSxPQUFPLENBQUMsYUFBYSxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUE7UUFDdkQsSUFBSSxPQUFPO1lBQUUsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLGtCQUFrQixDQUFBO1FBRXpELE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVUsRUFBRSxPQUFnQixLQUFLO1FBQ2hELE1BQU0sR0FBRyxHQUFHLE1BQU0sb0JBQUssQ0FBQyxHQUFHLGtDQUFTLFdBQVcsRUFBRSxTQUFTLElBQUksRUFBRSxFQUFFO1lBQ2hFLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUU7U0FDeEIsQ0FBQyxDQUFBO1FBRUYsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFnQjtRQUNoQyxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxrQ0FBUyxTQUFTLEVBQUU7WUFDN0MsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1lBQ2pDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztTQUM1QixDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFVLEVBQUUsR0FBWTtRQUMxQyxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxrQ0FBUyxXQUFXLEVBQUUsRUFBRSxFQUFFO1lBQ25ELE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztTQUMzQixDQUFDLENBQUE7UUFFRixPQUFPLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFVLEVBQUUsT0FBbUI7UUFDakQsSUFBSSxvQ0FBVztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztRQUUvRSxNQUFNLEdBQUcsR0FBRyxNQUFNLG9CQUFLLENBQUMsR0FBRyxrQ0FBUyxXQUFXLEVBQUUsRUFBRSxFQUFFO1lBQ25ELE1BQU0sRUFBRSxPQUFPO1lBQ2YsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNqQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7U0FDOUIsQ0FBQyxDQUFBO1FBRUYsT0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDbkIsQ0FBQztDQUNGO0FBR1EsMEJBQU87O0FBRGhCLGtCQUFlLE9BQU8sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgwqkgU2VyZW5Nb2R6MjEgMjAxOCAtIDIwMjEgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFVuYXV0aG9yaXplZCBkaXN0cmlidXRpb24gb2YgYW55IGNvZGUgd2l0aGluIHRoaXMgcHJvamVjdCBtYXkgcmVzdWx0IGluIGNvbnNlcXVlbmNlcyBjaG9zZW4gYnkgdGhlIEJvYXJkIE1lbWJlcnMuXG4gKiBSZWZlciB0byB0aGUgUkVBRE1FIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICovXG5cbmltcG9ydCBmZXRjaCBmcm9tIFwibm9kZS1mZXRjaFwiXG5pbXBvcnQgeyBQYXN0ZUdHT3B0aW9ucywgUGFzdGVPdXRwdXQsIFBvc3RQYXN0ZSwgSUhlYWRlciwgVXBkYXRlUG9zdCB9IGZyb20gXCIuL2ludGVyZmFjZXNcIlxuXG5jbGFzcyBQYXN0ZUdHIHtcbiAgLyoqIEF1dGgga2V5IGZvciBwYXN0ZS5nZyBBUEkgKi9cbiAgcmVhZG9ubHkgI2F1dGg6IHN0cmluZztcbiAgLyoqIFRoZSBmdWxsIFVSTCBmb3IgdGhlIEFQSSAqL1xuICByZWFkb25seSAjdXJsOiBzdHJpbmc7XG4gIC8qKiBUaGUgYmFzZSBVUkwgYW5kIEFQSSB2ZXJzaW9uIHVzZWQgKi9cbiAgcmVhZG9ubHkgb3B0aW9uczogUGFzdGVHR09wdGlvbnM7XG4gIC8qKiBUaGUgY3VycmVudCB2ZXJzaW9uIG9mIHRoZSBBUEkgd3JhcHBlciAqL1xuICByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBQYXN0ZUdHXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoIE9wdGlvbmFsIGF1dGgga2V5XG4gICAqIEBwYXJhbSB7UGFzdGVHR09wdGlvbnN9IG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIHBhc3RlIHNlcnZlclxuICAgKiBAY2xhc3Mge1Bhc3RlR0d9XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihhdXRoPzogc3RyaW5nLCBvcHRpb25zOiBQYXN0ZUdHT3B0aW9ucyA9IHtcbiAgICBiYXNlVXJsOiBcImh0dHBzOi8vYXBpLnBhc3RlLmdnXCIsXG4gICAgdmVyc2lvbjogMVxuICB9KSB7XG4gICAgdGhpcy4jYXV0aCA9IGF1dGg7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLnZlcnNpb24gPSBgdiR7cmVxdWlyZShcIi4uL3BhY2thZ2UuanNvblwiKS52ZXJzaW9ufWA7XG4gICAgdGhpcy4jdXJsID0gYCR7dGhpcy5vcHRpb25zLmJhc2VVcmx9L3Yke3RoaXMub3B0aW9ucy52ZXJzaW9ufWA7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGhlYWRlcnMgcmVxdWlyZWQgZm9yIHRoZSByZXF1ZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29udGVudFxuICAgKiBAcmV0dXJucyB7SUhlYWRlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgaGVhZGVycyhhdXRoPzogc3RyaW5nLCBjb250ZW50PzogYm9vbGVhbik6IElIZWFkZXIge1xuICAgIGNvbnN0IGhlYWRlcnM6IElIZWFkZXIgPSB7fVxuXG4gICAgaWYgKHRoaXMuI2F1dGgpIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGBLZXkgJHt0aGlzLiNhdXRofWBcbiAgICBpZiAoYXV0aD8ubGVuZ3RoKSBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgS2V5ICR7YXV0aH1gXG4gICAgaWYgKGNvbnRlbnQpIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIlxuXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIHBhc3RlLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZ1bGwgSW5jbHVkZXMgdGhlIGNvbnRlbnRzIG9mIGZpbGVzIGlmIHRydWUuXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBhc3RlT3V0cHV0Pn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgcHVibGljIGFzeW5jIGdldChpZDogc3RyaW5nLCBmdWxsOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPFBhc3RlT3V0cHV0PiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dGhpcy4jdXJsfS9wYXN0ZXMvJHtpZH0/ZnVsbD0ke2Z1bGx9YCwge1xuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzKClcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlcy5qc29uKClcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgcGFzdGUuXG4gICAqIEBwYXJhbSB7UG9zdFBhc3RlfSBpbnB1dCBUaGUgaW5mb3JtYXRpb24gdG8gY3JlYXRlIHRoZSBwYXN0ZSB3aXRoLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXN0ZU91dHB1dD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBwb3N0KGlucHV0OiBQb3N0UGFzdGUpOiBQcm9taXNlPFBhc3RlT3V0cHV0PiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dGhpcy4jdXJsfS9wYXN0ZXNgLCB7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzKG51bGwsIHRydWUpLFxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoaW5wdXQpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzLmpzb24oKVxuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYW4gZXhpc3RpbmcgcGFzdGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSUQgb2YgdGhlIHBhc3RlIHRvIGRlbGV0ZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtrZXldIEF1dGgga2V5IG9yIGRlbGV0aW9uIGtleSAobGVhdmUgYmxhbmsgaWYgeW91IGhhdmUgc2V0IHRoZSBhdXRoIGtleSBpbiB0aGUgY29uc3RydWN0b3IpXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPFBhc3RlT3V0cHV0IHwgdm9pZD59XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBkZWxldGUoaWQ6IHN0cmluZywga2V5Pzogc3RyaW5nKTogUHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChgJHt0aGlzLiN1cmx9L3Bhc3Rlcy8ke2lkfWAsIHtcbiAgICAgIG1ldGhvZDogXCJERUxFVEVcIixcbiAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyhrZXkpXG4gICAgfSlcblxuICAgIHJldHVybiByZXMuanNvbigpXG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGFuIGV4aXN0aW5nIHBhc3RlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIElEIGZvciB0aGUgcGFzdGUgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0ge1VwZGF0ZVBvc3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgeW91IHdpc2ggdG8gdXBkYXRlLlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxQYXN0ZU91dHB1dCB8IHZvaWQ+fVxuICAgKiBAcHVibGljXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgdXBkYXRlKGlkOiBzdHJpbmcsIG9wdGlvbnM6IFVwZGF0ZVBvc3QpOiBQcm9taXNlPFBhc3RlT3V0cHV0IHwgdm9pZD4ge1xuICAgIGlmICghdGhpcy4jYXV0aCkgdGhyb3cgbmV3IEVycm9yKFwiQW4gYXV0aCBrZXkgaXMgcmVxdWlyZWQgZm9yIHRoaXMgZW5kcG9pbnQhXCIpO1xuXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7dGhpcy4jdXJsfS9wYXN0ZXMvJHtpZH1gLCB7XG4gICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgIGhlYWRlcnM6IHRoaXMuaGVhZGVycyhudWxsLCB0cnVlKSxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpXG4gICAgfSlcblxuICAgIHJldHVybiByZXMuanNvbigpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFzdGVHRztcbmV4cG9ydCB7IFBhc3RlR0cgfTsiXX0=