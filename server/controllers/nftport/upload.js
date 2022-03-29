const runNFTUpload = (name, description, file) => {
    console.log(name)
    console.log(description)
    console.log(file)
    upload(file)
}

import config from '../../../config/config'
import FormData from "form-data"
import fetch from "cross-fetch"
import * as fs from "fs"

const AUTH = process.env.NFTPORT_API_KEY
const TIMEOUT = 1000; // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.

const allMetadata = [];

async function upload(file) {
    // let metaData = JSON.parse(jsonFile);
    // let uploadFile = false;
    let metaData = {}
    let response = await fetchWithRetry(file);
    let resUrl = response.ipfs_url;
    metaData.animation_url = resUrl;
    metaData.custom_fields = {};
    metaData.custom_fields.edition = Date.now();
    // let imageresponse = await fetchWithRetryImages(`${fileName}.png`);
    // metaData.file_url = imageresponse.ipfs_url;
    console.log(resUrl)

    // fs.writeFileSync(
    // `${basePath}/build/json/${fileName}.json`,
    // JSON.stringify(metaData, null, 2)
    // );
}

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithRetry(file)  {
  await timer(TIMEOUT)
  return new Promise((resolve, reject) => {
    const fetch_retry = (_file) => {
      const formData = new FormData();
      const fileStream = fs.createReadStream(`${_file}`);
      formData.append("file", fileStream);
      let url = "https://api.nftport.xyz/v0/files";
      let options = {
        method: "POST",
        headers: {
          Authorization: AUTH,
        },
        body: formData,
      };

      return fetch(url, options).then(async (res) => {
          const status = res.status;

          if(status === 200) {
            return res.json();
          }            
          else {
            console.error(`ERROR STATUS: ${status}`)
            console.log('Retrying')
            await timer(TIMEOUT)
            fetch_retry(_file)
          }            
      })
      .then(async (json) => {
        if(json.response === "OK"){
          return resolve(json);
        } else {
          console.error(`NOK: ${json.error}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_file)
        }
      })
      .catch(async (error) => {  
        console.error(`CATCH ERROR: ${error}`)  
        console.log('Retrying')    
        await timer(TIMEOUT)    
        fetch_retry(_file)
      });
    }        
    return fetch_retry(file);
  });
}

export {
    runNFTUpload
}