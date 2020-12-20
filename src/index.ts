/*
 * Copyright © SerenModz21 2018 - 2020 All Rights Reserved.
 * Unauthorized distribution of any code within this project may result in consequences chosen by the Board Members.
 * Refer to the README for more information.
 */


import fetch from "node-fetch"
import { PasteGGOptions, PasteOutput, PostPaste, IHeader, UpdatePost } from "./interfaces"

class PasteGG {
  readonly #auth: string;
  readonly #url: string;
  readonly options: PasteGGOptions;

  constructor(auth?: string, options: PasteGGOptions = {
    baseUrl: "https://api.paste.gg",
    version: 1
  }) {
    this.#auth = auth;
    this.options = options;
    this.#url = `${this.options.baseUrl}/v${this.options.version}`;
  }

  private headers(auth?: string, content?: boolean): IHeader {
    const headers: IHeader = {}

    if (this.#auth) headers.Authorization = `Key ${auth ?? this.#auth}`
    if (content) headers["Content-Type"] = "application/json"

    return headers
  }

  /**
   * Get an existing paste.
   * @param {string} id The ID of the paste.
   * @param {boolean} full Includes the contents of files if true.
   * @returns {Promise<PasteOutput>}
   */
  public async get(id: string, full: boolean = false): Promise<PasteOutput> {
    const res = await fetch(`${this.#url}/pastes/${id}?full=${full}`, {
      method: "GET",
      headers: this.headers()
    })

    return res.json()
  }

  /**
   * Create a new paste.
   * @param {PostPaste} input The information to create the paste with.
   * @returns {Promise<PasteOutput>}
   */
  public async post(input: PostPaste): Promise<PasteOutput> {
    const res = await fetch(`${this.#url}/pastes`, {
      method: "POST",
      headers: this.headers(null, true),
      body: JSON.stringify(input)
    });

    return res.json()
  }

  /**
   * Deletes an existing paste.
   * @param {string} id The ID of the paste to delete.
   * @param {string} key Auth key or deletion key, enter "auth" for auth key
   * @returns {Promise<null | PasteOutput>}
   */
  public async delete(id: string, key: string): Promise<null | PasteOutput> {
    const res = await fetch(`${this.#url}/pastes/${id}`, {
      method: "DELETE",
      headers: this.headers(key?.toLowerCase() !== "auth" ? key : null)
    })

    return res.json()
  }

  /**
   * Update an existing paste.
   * @param {string} id The ID for the paste to update.
   * @param {UpdatePost} options The options you wish to update.
   * @returns {Promise<null | PasteOutput>}
   */
  public async update(id: string, options: UpdatePost): Promise<null | PasteOutput> {
    const res = await fetch(`${this.#url}/pastes/${id}`, {
      method: "PATCH",
      headers: this.headers(null, true)
    })

    return res.json()
  }
}

export default PasteGG;
export { PasteGG }