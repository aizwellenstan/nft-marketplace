const runNFTUpload = (name, description, file) => {
    let url = nftPortUploader(name, description, file)
    return url
}

import config from '../../../config/config'
import FormData from "form-data"
import fetch from "cross-fetch"
import * as fs from "fs"

const AUTH = process.env.NFTPORT_API_KEY
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const MINT_TO_ADDRESS = process.env.WALLET_ADDRESS;
const CHAIN = process.env.CHAIN;
const TIMEOUT = 1000; // Milliseconds. Extend this if needed to wait for each upload. 1000 = 1 second.

const allMetadata = [];

async function nftPortUploader(name, description, file) {
  let openSeaUrl = ""
  let metaData = {}
  let response = await nftPortFileUploader(file);
  let imageUrl = response.ipfs_url;
  metaData.animation_url = imageUrl;
  metaData.file_url = imageUrl;
  metaData.image = imageUrl;
  metaData.custom_fields = {};
  metaData.custom_fields.edition = Date.now();
  metaData.name = name;
  metaData.description = description;
  metaData.attributes = [];

  let filePath = `${file.substr(0,file.lastIndexOf('/'))}/${name}_${description}_${metaData.custom_fields}.json`;
  fs.writeFile(filePath, JSON.stringify(metaData), (err)=>{
    if(err) console.log(`error!::${err}`);
    let jsonFile = fs.readFileSync(filePath);
    response = nftPortMetaUploader(jsonFile);
    response.then(function(res) {
      metaData.metadata_uri = res.metadata_uri;
      fs.unlink(filePath, function (err) {
        if (err) throw err;
      });
      let wallet = MINT_TO_ADDRESS
      let mintRes = mint(metaData, wallet)
      mintRes.then(function(res) {
        openSeaUrl = `https://opensea.io/assets/matic/${res.contract_address}/${metaData.custom_fields.edition}`
        console.log(openSeaUrl)
        return openSeaUrl
      })
    })
  });
  
  return openSeaUrl
}

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function nftPortFileUploader(file)  {
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

async function nftPortMetaUploader(file)  {
  await timer(TIMEOUT);
  return new Promise((resolve, reject) => {
    const fetch_retry = (_file) => {
      let url = "https://api.nftport.xyz/v0/metadata";
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH,
        },
        body: _file,
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

async function mint(meta, wallet)  {
  await timer(TIMEOUT);
  return new Promise((resolve, reject) => {
    const fetch_retry = (_meta) => {
      let url = "https://api.nftport.xyz/v0/mints/customizable";

      const mintInfo = {
        chain: CHAIN,
        contract_address: CONTRACT_ADDRESS,
        metadata_uri: _meta.metadata_uri,
        mint_to_address: wallet,
        token_id: _meta.custom_fields.edition,
      };

      console.log(mintInfo)

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH,
        },
        body: JSON.stringify(mintInfo),
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
          fetch_retry(_meta)
        }            
      })
      .then(async (json) => {
        if(json.response === "OK"){
          return resolve(json);
        } else {
          console.error(`NOK: ${json.error}`)
          console.log('Retrying')
          await timer(TIMEOUT)
          fetch_retry(_meta)
        }
      })
      .catch(async (error) => {  
        console.error(`CATCH ERROR: ${error}`)  
        console.log('Retrying')    
        await timer(TIMEOUT)    
        fetch_retry(_meta)
      });
    }          
    return fetch_retry(meta);
  });
}

export {
    runNFTUpload
}