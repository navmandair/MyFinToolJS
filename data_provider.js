const path = require('path');
const https = require('https');
const dotenv = require('dotenv');
const result = dotenv.config({ path: path.join(__dirname, 'custom.env') });
if (result.error) {
  throw result.error
}
const apiKey = process.env.DATAPROVIDER_API_TOKEN;

const baseUrl = 'www.alphavantage.co';

const searchTicker = (searchKey, callback) => {
  let requestURL = `/query?function=SYMBOL_SEARCH&keywords=${searchKey}&apikey=${apiKey}`;
  const options = {
    hostname: baseUrl,
    path: requestURL,
    method: 'GET'
  }

  const req = https.request(options, (res) => {
    let data = ''
    console.log(`statusCode: ${res.statusCode}`)
    res.on('data', d => {
      data += d
    })

    res.on('end', function() {
      try {
        return callback(JSON.parse(data));
      }
      catch
      {
        console.log(`failed to parse response from : ${requestURL}`);
        return callback({});
      }
    });
  });

  req.on('error', error => {
    console.error(error)
  });

  req.end();

}

const historicalData = (symbol) => {
  return new Promise((resolve, reject) => {
    let outputSize = 'full';
    let requestURL = `/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=${outputSize}&apikey=${apiKey}`;
    const options = {
      hostname: baseUrl,
      path: requestURL,
      method: 'GET'
    }
    console.log(`requestURL: ${requestURL}`);
    const req = https.request(options, (res) => {
      let data = '';
      console.log(`statusCode: ${res.statusCode}`)
      res.on('data', d => {
        data += d
      })

      res.on('end', function() {
        try {
          let new_data = [];
          console.log(`data.length: ${data.length}`);
          let obj = JSON.parse(data)["Time Series (Daily)"];
          var keys = Object.values(obj);
          console.log(`keys.length: ${keys.length}`);
          for (let key in obj) {
            let subObj = obj[key];
            new_data.push({ date: key, adjClose: subObj['5. adjusted close'] })
          }
          return resolve(new_data);
        }
        catch (e) {
          console.log(`failed to parse response from : ${requestURL}`, e);
          return reject(e);
        }
      });
    });

    req.on('error', error => {
      console.error(error)
    });

    req.end();
  })
}

module.exports = {
  searchTicker,
  historicalData
}



