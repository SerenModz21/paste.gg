import { ParsedUrlQueryInput as Input, stringify } from "querystring";
import {
    Author,
    Content,
    File,
    IHeader,
    Methods,
    Options,
    Output,
    Post,
    Result,
    Update,
} from "./interfaces";

const defaultOptions = <Options>{
    baseUrl: "https://api.paste.gg",
    mainUrl: "https://paste.gg",
    version: 1,
};

/**
 * The main class for interacting with the Paste.gg API
 */
class PasteGG {
    readonly #auth: string;
    readonly #url: string;
    readonly options: Options;
    readonly version: string;

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
    constructor(auth?: string, options: Options = defaultOptions) {
        /**
         * The auth key
         * @type {string}
         * @private
         * @readonly
         */
        this.#auth = auth;
        /**
         * The options for the paste server
         * @type {Options}
         * @public
         * @readonly
         */
        this.options = Object.assign<Options, Options>(defaultOptions, options);
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
        this.#url = `${this.options.baseUrl}/v${this.options.version}`;
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
    private async _request<T>(
        method: keyof typeof Methods,
        path: string,
        body?: object,
        key?: string,
    ): Promise<T> {
        const headers: IHeader = {};
        if (this.#auth) headers.Authorization = `Key ${this.#auth}`;
        if (key?.length) headers.Authorization = `Key ${key}`;
        if (method !== "GET") headers["Content-Type"] = "application/json";

        let urlPath = `${this.#url}${path}`;
        if (body && method === "GET") urlPath += `?${stringify(<Input>body)}`;

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
    async get(id: string, full: boolean = false): Promise<Output> {
        if (!id?.length) {
            throw new Error("A paste ID is required to use PasteGG#get()");
        }

        return this._request<Output>(Methods.GET, `/pastes/${id}`, { full });
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
    async post(input: Post): Promise<Output> {
        if (!input) {
            throw new Error(
                "An input object is required to use PasteGG#post()",
            );
        }

        const res = await this._request<Output>(Methods.POST, "/pastes", input);
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
    async delete(id: string, key?: string): Promise<Output | void> {
        if (!this.#auth?.length && !key?.length)
            throw new Error(
                "An auth key or deletion key is needed to use PasteGG#delete()",
            );

        return this._request<Output>(
            Methods.DELETE,
            `/pastes/${id}`,
            null,
            key,
        );
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
    async update(id: string, options: Update): Promise<Output | void> {
        if (!this.#auth?.length)
            throw new Error("An auth key is required to use PasteGG#update()");

        if (!options.name) options.name = null;
        return this._request<Output>(Methods.PATCH, `/pastes/${id}`, options);
    }
}

export { PasteGG };
export default PasteGG;
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
