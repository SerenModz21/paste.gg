/*
 * Copyright © SerenModz21 2018 - 2020 All Rights Reserved.
 * Unauthorized distribution of any code within this project may result in consequences chosen by the Board Members.
 * Refer to the README for more information.
 */

export type IHeader = {
  "Content-Type"?: string;
  Authorization?: string;
}

export interface PasteGGOptions {
  baseUrl: string;
  version: number;
}

export interface PasteOutput {
  status: string;
  result?: {
    id: string;
    name?: string;
    description?: string;
    visibility?: "public" | "*unlisted" | "unlisted" | "private";
    created_at: string;
    updated_at: string;
    expires?: string;
    files?: Files[];
    deletion_key?: string;
  };
  error?: string;
  message?: string;
}

export interface PostPaste {
  name?: string;
  description?: string;
  visibility?: "public" | "*unlisted" | "unlisted" | "private";
  expires?: string;
  files: PostFiles[];
}

export interface UpdatePost {
  name?: string;
  description: string;
}

interface Files {
  id: string;
  name: string;
  highlight_language: string | null;
}

interface PostFiles {
  name?: string;
  content: {
    format: "text" | "base64" | "gzip" | "xz";
    highlight_language?: string;
    value: string;
  }
}