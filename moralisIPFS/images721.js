let fs = require('fs')
const path = require("path");
let axios = require('axios')
require('dotenv').config()

const MORALIS_ENDPOINT = process.env.MORALIS

//? Promises to be pushed to this var
let promiseArray = []
//? For IPFS
let imageArray = []


for (let i = 1; i <= 5; i++) {
      console.log(i)
      promiseArray.push(new Promise((res, rej) => {
            fs.readFile((`${__dirname}/build/images/${i}.png`), (err, data) => {
                  if (err) rej();
                  imageArray.push({
                        path: `images/${i}.png`,
                        content: data.toString("base64")
                  })
                  res();
            })
      }))
}

//? Once all promises are done 
Promise.all(promiseArray).then(() => {
      axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
            imageArray,
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