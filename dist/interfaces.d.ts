export declare type IHeader = {
    /** The request content type */
    "Content-Type"?: string;
    /** Authorization for the request  */
    Authorization?: string;
};
export interface PasteGGOptions {
    /** The base URL of the API */
    baseUrl: string;
    /** The version of the API */
    version: number;
}
export interface PasteOutput {
    /** The output status which can be "success" or "error" */
    status: string;
    /** The result data object */
    result?: {
        /** The ID of the paste */
        id: string;
        /** The name of the created paste */
        name?: string;
        /** The description of the created paste */
        description?: string;
        /** The visibility of the created paste */
        visibility?: "public" | "unlisted" | "private";
        /** The date the paste was created */
        created_at: string;
        /** The date the paste was last updated */
        updated_at: string;
        /** The date when the paste expires */
        expires?: string;
        /** The files used in the created paste */
        files?: Files[];
        /** The deletion key of the created paste */
        deletion_key?: string;
    };
    /** The error key */
    error?: string;
    /** (Optional) The error message */
    message?: string;
}
export interface PostPaste {
    /** (Optional) The name of the paste */
    name?: string;
    /** (Optional) The description of the paste (must be less than 25 KiB) */
    description?: string;
    /** (Optional) The visibility of the paste (defaults to unlisted) */
    visibility?: "public" | "unlisted" | "private";
    /** (Optional) The expiration date of the paste (must be a UTC ISO 8601 string) */
    expires?: string;
    /** (Required) Array of files to add to the paste (at least one file) */
    files: PostFiles[];
}
export interface UpdatePost {
    /** (Optional) The new name of the post */
    name?: string;
    /** (Required) The new description of the post */
    description: string;
}
interface Files {
    /** The ID of the file */
    id: string;
    /** The name of the file */
    name: string;
    /** The syntax highlighting language used */
    highlight_language: string | null;
}
interface PostFiles {
    /** (Optional) The name of the file */
    name?: string;
    /** (Required) The content of the file */
    content: {
        /** (Required) The format of the file */
        format: "text" | "base64" | "gzip" | "xz";
        /** (Optional) The syntax highlighting language to use */
        highlight_language?: string;
        /** (Required) The value of the file contents */
        value: string;
    };
}
export {};