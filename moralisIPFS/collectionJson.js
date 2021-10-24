//todo - bundle collection uploads in one script
let fs = require('fs')
const path = require("path");
let axios = require('axios')

require('dotenv').config()

const MORALIS_ENDPOINT = process.env.MORALIS

//? Promises to be pushed to this var
let promiseArray = []
//? Array of json For IPFS
let jsonData = []

promiseArray.push(new Promise((res, rej) => {
      fs.readFile((`${__dirname}/collection#1/metadata.json`), (err, data) => {
            if (err) rej();
            const parsed = JSON.parse(data)
            jsonData.push({
                  path: `collection-1/collection.json`,
                  content: {
                        ...parsed,
                        image: `ipfs://Qmbd46WBvCK33kuGcEb7LtQkWcXW3ygDEgBv5rdFvnJ7RX/collection-1/image.gif`
                  }
            })
            res();
      })
}))


//? Once all promises are done, then post json array to Moralis IPFS endpoint
Promise.all(promiseArray).then(() => {
      axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
            jsonData,
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


