import { stringify } from 'node:querystring';

var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var defaultOptions = {
  baseUrl: "https://api.paste.gg",
  mainUrl: "https://paste.gg",
  version: 1
};
var _auth, _url;
var _PasteGG = class _PasteGG {
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
    __privateAdd(this, _auth);
    __privateAdd(this, _url);
    __privateSet(this, _auth, auth);
    this.options = Object.assign(defaultOptions, options);
    this.version = "v1.0.5";
    __privateSet(this, _url, `${this.options.baseUrl}/v${this.options.version}`);
  }
  /**
   * Make a request to the API.
   * @param {keyof typeof Methods} method
   * @param {string} path
   * @param {object} body
   * @param {string} key
   * @returns {Promise<Output<T>>}
   * @private
   */
  async _request(method, path, body, key) {
    const headers = {};
    if (__privateGet(this, _auth)) headers.Authorization = `Key ${__privateGet(this, _auth)}`;
    if (key?.length) headers.Authorization = `Key ${key}`;
    if (method !== "GET") headers["Content-Type"] = "application/json";
    let urlPath = `${__privateGet(this, _url)}${path}`;
    if (body && method === "GET") urlPath += `?${stringify(body)}`;
    const res = await fetch(urlPath, {
      method,
      headers,
      body: body && method !== "GET" ? JSON.stringify(body) : null
    });
    try {
      return await res.json();
    } catch (e) {
      if (e instanceof Error && e.message === "Unexpected end of JSON input") {
        return { status: "success", result: null };
      }
      return { status: "error", error: e.name, message: e.message };
    }
  }
  /**
   * Get an existing paste.
   * @see https://github.com/ascclemens/paste/blob/master/api.md#get-pastesid
   * @param {string} id The ID of the paste.
   * @param {boolean} full Includes the contents of files if true.
   * @returns {Promise<ResultOutput>}
   * @public
   * @example
   * // if you would like to exclude file contents
   * await pasteGG.get("idHere")
   *
   * // If you would like to include file contents
   * await pasteGG.get("idHere", true)
   */
  async get(id, full = false) {
    if (!id?.length) {
      throw new Error("A paste ID is required to use PasteGG#get()");
    }
    return this._request("GET" /* GET */, `/pastes/${id}`, { full });
  }
  /**
   * Create a new paste.
   * @see https://github.com/ascclemens/paste/blob/master/api.md#post-pastes
   * @param {Post} input The information to create the paste with.
   * @returns {Promise<ResultOutput>}
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
      throw new Error(
        "An input object is required to use PasteGG#post()"
      );
    }
    const res = await this._request("POST" /* POST */, "/pastes", input);
    if (res.status === "success")
      res.result.url = `${this.options.mainUrl}/${res.result.id}`;
    return res;
  }
  /**
   * Deletes an existing paste.
   * @see https://github.com/ascclemens/paste/blob/master/api.md#delete-pastesid
   * @param {string} id The ID of the paste to delete.
   * @param {string} [key] Auth key or deletion key (leave blank if you have set the auth key in the constructor)
   * @returns {Promise<Output<null>>}
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
    if (!__privateGet(this, _auth)?.length && !key?.length)
      throw new Error(
        "An auth key or deletion key is needed to use PasteGG#delete()"
      );
    return this._request(
      "DELETE" /* DELETE */,
      `/pastes/${id}`,
      null,
      key
    );
  }
  /**
   * Update an existing paste.
   * @see https://github.com/ascclemens/paste/blob/master/api.md#patch-pastesid
   * @param {string} id The ID for the paste to update.
   * @param {Update} options The options you wish to update.
   * @returns {Promise<Output<null>>}
   * @public
   * @example
   * await pasteGG.update("idHere", {
   *   name: "new name", // Optional (if you want to remove the name)
   *   description: "new description"
   * })
   */
  async update(id, options) {
    if (!__privateGet(this, _auth)?.length)
      throw new Error("An auth key is required to use PasteGG#update()");
    if (!options.name) options.name = null;
    return this._request("PATCH" /* PATCH */, `/pastes/${id}`, options);
  }
};
_auth = new WeakMap();
_url = new WeakMap();
__name(_PasteGG, "PasteGG");
var PasteGG = _PasteGG;

export { PasteGG as default };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map