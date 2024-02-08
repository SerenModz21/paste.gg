interface Options {
    baseUrl: string;
    mainUrl: string;
    version: number;
}
interface Result {
    id: string;
    name?: string;
    url?: string;
    author?: Author;
    description?: string;
    visibility?: "public" | "unlisted" | "private";
    created_at: string;
    updated_at: string;
    expires?: string;
    files?: File[];
    deletion_key?: string;
}
type Output<T = Result> = {
    status: "success";
    result: T;
} | {
    status: "error";
    error: string;
    message: string;
};
type ResultOutput = Output<Result>;
interface Author {
    id?: string;
    username?: string;
    name?: string;
}
interface Post extends Pick<Result, "name" | "description" | "visibility" | "expires"> {
    files: FileOut[];
}
interface Update extends Pick<Result, "name"> {
    description: string;
}
interface File {
    id: string;
    name: string;
    highlight_language?: string;
}
interface FileOut {
    name?: string;
    content: Content;
}
interface Content extends Pick<File, "highlight_language"> {
    format: "text" | "base64" | "gzip" | "xz";
    value: string;
}

/**
 * The main class for interacting with the Paste.gg API
 */
declare class PasteGG {
    #private;
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
    constructor(auth?: string, options?: Options);
    /**
     * Make a request to the API.
     * @param {keyof typeof Methods} method
     * @param {string} path
     * @param {object} body
     * @param {string} key
     * @returns {Promise<Output<T>>}
     * @private
     */
    private _request;
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
    get(id: string, full?: boolean): Promise<Output>;
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
    post(input: Post): Promise<ResultOutput>;
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
    delete(id: string, key?: string): Promise<Output<null>>;
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
    update(id: string, options: Update): Promise<Output<null>>;
}

export { PasteGG as default };
