/*
 * Copyright © SerenModz21 2018 - 2021 All Rights Reserved.
 * Unauthorized distribution of any code within this project may result in consequences chosen by the Board Members.
 * Refer to the README for more information.
 */

import fetch from "node-fetch";
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
   */
  public constructor(
    auth?: string,
    options: Options = {
      baseUrl: "https://api.paste.gg",
      mainUrl: "https://paste.gg",
      version: 1,
    }
  ) {
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
    key?: string
  ): Promise<T> {
    const headers: IHeader = {};
    if (this.#auth) headers.Authorization = `Key ${this.#auth}`;
    if (key?.length) headers.Authorization = `Key ${key}`;
    if (method !== "GET") headers["Content-Type"] = "application/json";

    let urlPath = `${this.#url}${path}`;
    if (body && method === "GET") urlPath += `?${stringify(<Input>body)}`;

    const response = await fetch(urlPath, {
      method,
      headers,
      body: body && method !== "GET" ? JSON.stringify(body) : null,
    });

    return response.json();
  }

  /**
   * Get an existing paste.
   * @param {string} id The ID of the paste.
   * @param {boolean} full Includes the contents of files if true.
   * @returns {Promise<Output>}
   * @public
   */
  public async get(id: string, full: boolean = false): Promise<Output> {
    if (!id?.length)
      throw new Error("A paste ID is required to use PasteGG#get()");

    return this._request<Output>(Methods.GET, `/pastes/${id}`, { full });
  }

  /**
   * Create a new paste.
   * @param {Post} input The information to create the paste with.
   * @returns {Promise<Output>}
   * @public
   */
  public async post(input: Post): Promise<Output> {
    if (!input)
      throw new Error("An input object is required to use PasteGG#post()");

    const res = await this._request<Output>(Methods.POST, "/pastes", input);
    if (res.result) res.result.url = `${this.options.mainUrl}/${res.result.id}`;
    return res;
  }

  /**
   * Deletes an existing paste.
   * @param {string} id The ID of the paste to delete.
   * @param {string} [key] Auth key or deletion key (leave blank if you have set the auth key in the constructor)
   * @returns {Promise<Output | void>}
   * @public
   */
  public async delete(id: string, key?: string): Promise<Output | void> {
    if (!this.#auth?.length && !key?.length)
      throw new Error(
        "An auth key or deletion key is needed to use PasteGG#delete()"
      );

    return await this._request<Output>(
      Methods.DELETE,
      `/pastes/${id}`,
      null,
      key
    );
  }

  /**
   * Update an existing paste.
   * @param {string} id The ID for the paste to update.
   * @param {Update} options The options you wish to update.
   * @returns {Promise<Output | void>}
   * @public
   */
  public async update(id: string, options: Update): Promise<Output | void> {
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
 * @property {string} baseUrl The base URL of the API
 * @property {string} mainUrl The URL of the main website
 * @property {number} version The version of the API
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
