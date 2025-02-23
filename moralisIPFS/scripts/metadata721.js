let fs = require("fs");
let axios = require("axios");
const path = require("path");
require('dotenv').config()
const numOfItems = require('./numOfItems')

const MORALIS_ENDPOINT = process.env.MORALIS


let jsonArray = [];
let promiseArray = [];

for (let i = 1; i <= numOfItems; i++) {
      promiseArray.push(new Promise((res, rej) => {
            fs.readFile(path.resolve(__dirname, `..build/json/${i}.json`), (err, data) => {
                  if (err) rej();
                  //? Read the JSONs and use spread syntax to change the 'image' key/value
                  const parsed = JSON.parse(data)
                  jsonArray.push({
                        path: `metadata/${i}.json`,
                        content: {
                              ...parsed,
                              image: `ipfs://Qmbu8Azpmd47n5LWVxd6v3DpdPuqgFg6XLiZgNNJrCxj7b/images/${i}.png`
                        }
                  })
                  res();
            })
      }))
}

//? Once all promises (file reads and parses) are done, then post json array to Moralis IPFS endpoint
Promise.all(promiseArray).then(() => {
      axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
            jsonArray,
            {
                  headers: {
                        "X-API-KEY": MORALIS_ENDPOINT,
                        "Content-Type": "application/json",
                        "accept": "application/json"
                  }
            }
      ).then((res) => {
            console.log(res.data);
      }).catch((error) => {
            console.log(error)
      })

})
