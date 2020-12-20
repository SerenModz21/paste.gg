/*
 * Copyright © SerenModz21 2018 - 2020 All Rights Reserved.
 * Unauthorized distribution of any code within this project may result in consequences chosen by the Board Members.
 * Refer to the README for more information.
 */


import PasteGG from "../src/index"
const paste = new PasteGG();

(async () => {
  const post = await paste.post({
    name: "text.txt",
    description: "this is a test",
    expires: "2020-12-21T02:25:56.428Z",
    files: [{
      name: "wrapper.txt",
      content: {
        format: "text",
        value: "This has been posted from a paste.gg wrapper by Seren_Modz 21"
      }
    }]
  })

  console.log(post)
  console.log(`https://paste.gg/${post?.result.id ?? "null"}`)
})()