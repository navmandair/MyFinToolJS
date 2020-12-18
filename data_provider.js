const path = require('path');
const https = require('https');
const dotenv = require('dotenv');
const result = dotenv.config({ path: path.join(__dirname, 'custom.env') });
if (result.error) {
  throw result.error
}
const apiKey = process.env.DATAPROVIDER_API_TOKEN;

const baseUrl = 'www.alphavantage.co';

const searchTicker = (searchKey, callback)=> {
  let requestURL = `/query?function=SYMBOL_SEARCH&keywords=${searchKey}&apikey=${apiKey}`;
  const options = {
    hostname: baseUrl,
    path: requestURL,
    method: 'GET'
  }

  const req = https.request(options, (res) => {
    let data = []
     console.log(`statusCode: ${res.statusCode}`)
    res.on('data', d => {
      data.push(d)
    })

    res.on('end', function() {
      try
      {
        return callback(JSON.parse(data.toString()));
      }
      catch
      {
        return callback({});
      }
    });
  });

  req.on('error', error => {
    console.error(error)
  });
  
  req.end();

}


module.exports = {
  searchTicker
}



