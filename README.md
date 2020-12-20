# paste.gg
A wrapper for the paste.gg api <br/>

**[Documentation](https://github.com/ascclemens/paste/blob/master/api.md#api)** <br/>
**[GitHub](https://github.com/SerenModz21/paste.gg)** <br/>

> Install with npm
```
npm install paste.gg
```
<br/>

> Install with yarn
```
yarn add paste.gg
```
<br/>

> Get started with paste.gg
```ts
import PasteGG from "paste.gg"

// If you want to be anonymous
const pasteGG = new PasteGG()

// If you want to use an api key
const pasteGG = new PasteGG("apiKeyHere")
```
<br/>

> Get information about a post
```ts
await pasteGG.get("idHere")

// If you would like to include file contents
await pasteGG.get("idHere", true)
```
<br/>

> Post a new paste ([Click here for more options](https://github.com/ascclemens/paste/blob/master/api.md#post-pastes))
```ts
await pasteGG.post({
  name: "Paste name", // Optional
  description: "Paste description", // Optional
  expires: "2020-12-21T02:25:56.428Z", // Optional
  files: [{
    name: "file.txt", // Optional
    content: {
      format: "text",
      value: "This is where the file content wil lgo"
    }
  }]
})
```
<br/>

> Delete a paste (auth/deletion key needed)
```ts
// Delete with deletion key
await pasteGG.delete("idHere", "deletionKeyHere")

// Delete with auth key if not set in constructor
await pasteGG.delete("idHere", "authKeyHere") 

// If you have set your auth key in the class constructor, you can type "auth" for the key
await pasteGG.delete("idHere", "auth")
```
<br/>

> Update the post
```ts
await pasteGG.update("idHere", {
  name: "new name", // Optional (if you want to remove the name)
  description: "new description"
})
```
<br/>

---
<br/>

Contributions are more than welcome. If you would like to add to this API, you can open a pull request as I haven't added everything on the API, only the things that will get used more often.

Copyright © SerenModz21 2018 - 2020