/*
 * Copyright © SerenModz21 2018 - 2021 All Rights Reserved.
 * Unauthorized distribution of any code within this project may result in consequences chosen by the Board Members.
 * Refer to the README for more information.
 */

import fetch from "node-fetch";
import {
  PasteGGOptions,
  PasteOutput,
  PostPaste,
  IHeader,
  UpdatePost,
  PostFiles,
  Files,
  OutputResult,
  PostContent,
} from "./interfaces";

class PasteGG {
  /** Auth key for paste.gg API */
  readonly #auth: string;
  /** The full URL for the API */
  readonly #url: string;
  /** The base URL and API version used */
  readonly options: PasteGGOptions;
  /** The current version of the API wrapper */
  readonly version: string;

  /**
   * Create a new instance of PasteGG
   * @param {string} auth Optional auth key
   * @param {PasteGGOptions} options Options for the paste server
   * @class PasteGG
   * @public
   */
  public constructor(
    auth?: string,
    options: PasteGGOptions = {
      baseUrl: "https://api.paste.gg",
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
    this.#url = `${this.options.baseUrl}/v${this.options.version}`;
  }

  /**
   * The headers required for the request
   * @param {string} auth
   * @param {boolean} content
   * @returns {IHeader}
   * @private
   */
  private headers(auth?: string, content?: boolean): IHeader {
    const headers: IHeader = {};

    if (this.#auth) headers.Authorization = `Key ${this.#auth}`;
    if (auth?.length) headers.Authorization = `Key ${auth}`;
    if (content) headers["Content-Type"] = "application/json";

    return headers;
  }

  /**
   * Get an existing paste.
   * @param {string} id The ID of the paste.
   * @param {boolean} full Includes the contents of files if true.
   * @returns {Promise<PasteOutput>}
   * @public
   */
  public async get(id: string, full: boolean = false): Promise<PasteOutput> {
    const res = await fetch(`${this.#url}/pastes/${id}?full=${full}`, {
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
  public async post(input: PostPaste): Promise<PasteOutput> {
    const res = await fetch(`${this.#url}/pastes`, {
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
  public async delete(id: string, key?: string): Promise<PasteOutput | void> {
    const res = await fetch(`${this.#url}/pastes/${id}`, {
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
  public async update(
    id: string,
    options: UpdatePost
  ): Promise<PasteOutput | void> {
    if (!this.#auth)
      throw new Error("An auth key is required for this endpoint!");

    const res = await fetch(`${this.#url}/pastes/${id}`, {
      method: "PATCH",
      headers: this.headers(null, true),
      body: JSON.stringify(options),
    });

    return res.json();
  }
}

export default PasteGG;
export { PasteGG };

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
