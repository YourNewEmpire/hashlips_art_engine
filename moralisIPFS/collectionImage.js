let fs = require('fs')
const path = require("path");
let axios = require('axios')

require('dotenv').config()

const MORALIS_ENDPOINT = process.env.MORALIS

//? Promises to be pushed to this var
let promiseArray = []
//? For IPFS
let imageData = []

promiseArray.push(new Promise((res, rej) => {
      fs.readFile((`${__dirname}/collection#1/collection-image.gif`), (err, data) => {
            if (err) rej();
            imageData.push({
                  path: 'collection-1/image.gif',
                  content: data.toString("base64")
            })
            res();
      })
}))


//? Once all promises are done, then post json array to Moralis IPFS endpoint
Promise.all(promiseArray).then(() => {
      axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
            imageData,
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


