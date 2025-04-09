<div align="center">
  <h1>paste.gg</h1>
  <a href="https://www.npmjs.com/package/paste.gg"><img src="https://img.shields.io/npm/v/paste.gg.svg?maxAge=3600" alt="NPM version" /></a>
  <a href="https://www.npmjs.com/package/paste.gg"><img src="https://img.shields.io/npm/dt/paste.gg.svg?maxAge=3600" alt="NPM downloads" /></a>
  <a href="https://github.com/SerenModz21/paste.gg/actions"><img src="https://github.com/SerenModz21/paste.gg/actions/workflows/github-code-scanning/codeql/badge.svg" alt="Build status" /></a>
  <a href="https://github.com/SerenModz21/paste.gg"><img src="https://img.shields.io/github/languages/code-size/SerenModz21/paste.gg" alt="GitHub code size"></a>
  <br />
  <p style="max-width: 600px">
    A library for interacting with the Paste.GG API. I have created this in a short amount of time and will expect more updates in the future. The main purpose of this is to help users from having to create API calls.
  </p>
</div>

### Links

- **[API Documentation](https://github.com/ascclemens/paste/blob/master/api.md#api)** <br/>
- **[GitHub](https://github.com/SerenModz21/paste.gg)** <br/>
- **[NPM](https://www.npmjs.com/package/paste.gg)** <br/>

### Installation

```sh
# Stable release
npm install paste.gg

# Next release (changes on GitHub that haven't been released yet)
npm install paste.gg@next
```

## Getting Started

#### Create a new instance of the wrapper

```ts
// CommonJS (CJS)
const PasteGG = require("paste.gg");
// ES Modules (ESM)
import PasteGG from "paste.gg";

// If you want to be anonymous
const pasteGG = new PasteGG();

// If you want to use an api key
const pasteGG = new PasteGG("apiKeyHere");
```

#### Get information about a post

```ts
// if you would like to exclude file contents
await pasteGG.get("idHere");

// If you would like to include file contents
await pasteGG.get("idHere", true);
```

#### Post a new paste ([Click here for more options](https://github.com/ascclemens/paste/blob/master/api.md#post-pastes))

```ts
await pasteGG.post({
    name: "Paste name", // Optional
    description: "Paste description", // Optional
    expires: "2020-12-21T02:25:56.428Z", // Optional (must be a UTC ISO 8601 string)
    files: [
        {
            name: "file.txt", // Optional
            content: {
                format: "text",
                value: "This is where the file content will go",
            },
        },
    ],
});
```

#### Delete a paste (auth/deletion key needed)

```ts
// Delete with deletion key
await pasteGG.delete("idHere", "deletionKeyHere");

// Delete with auth key if not set in constructor
await pasteGG.delete("idHere", "authKeyHere");

// Leave blank if auth key is in the class constructor
await pasteGG.delete("idHere");
```

#### Update the post

```ts
await pasteGG.update("idHere", {
    name: "new name", // Optional (if you want to remove the name)
    description: "new description",
});
```

## Contributors

Contributions are more than welcome. If you would like to add to the API wrapper, free free to open a pull request. I've only added the endpoints that I thought would be most common.

Thank you to all the people who already contributed.

<a href="https://github.com/SerenModz21/paste.gg/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=SerenModz21/paste.gg" />
</a>
