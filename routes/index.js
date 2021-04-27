const yahooFinance = require('yahoo-finance');
const express = require('express');
const fs = require('fs');
var router = express.Router();
const DataProvider = require('../data_provider.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { "rows": [] });
});

router.get('/result', (req, res) => {
  try {
    var tickers_raw = req.query.tickers;
    var from_date = req.query.start_date;
    var to_date = req.query.end_date
    var period = req.query.period;
    var api = req.query.api;
    var amount = parseInt(req.query.amount);
    var tickers = []
    if (Array.isArray(tickers_raw)) {
      tickers = tickers_raw
    }
    else {
      tickers.push(tickers_raw)
    }
    historicalDataMultiple(api, tickers, from_date, to_date, period, amount).then(
      function(value) {
        writeSearchLog(tickers.toString());
        res.render('index', {
          "error": "No Error",
          "rows": value
        });
      },
      function(error) {
        res.render('index', {
          "error": error,
          "rows": []
        });
      }
    );

  }
  catch (e) {
    res.send("Something went wrong! " + e)
  }
})

async function historicalDataMultiple(api, tickers, from_date, to_date, period, amount) {
  var rows = [];
  tickers.forEach(ticker => {
    if (api == 'yahoo') {
      rows.push(yFinance(ticker, from_date, to_date, period, amount));
    }
    else if (api == 'alphavantage') {
      rows.push(alphavantage(ticker, from_date, to_date, period, amount));
    }

    //console.log(row);
  });
  //console.log(rows);
  rows = await Promise.all(rows);
  return rows;
}

async function yFinance(ticker, from_date, to_date, period, amount) {
  let promise = yahooFinance.historical({
    symbol: ticker,
    from: from_date,
    to: to_date,
    period: "d"
  });
  let quotes = await promise;
  return performance(ticker, from_date, period, quotes.reverse(), amount);
}

async function alphavantage(ticker, from_date, to_date, period, amount) {

  let promise = DataProvider.historicalData(ticker);
  let quotes = await promise;
  return performance(ticker, from_date, period, quotes.reverse(), amount);
}

async function performance(ticker, from_date, period, data, amount_investing) {
  amount_invested = 0;
  number_of_shares = 0;
  last_close = 0;
  lowest_close_from_last = 0;
  lowest_close_from_last_date = null;
  day_of_investing = new Date(from_date).getDay();
  new_data = [];
  data.forEach(el => {
    if (period == "d" || (period == "w" && new Date(el.date).getDay() == day_of_investing)) {
      new_data.push(el);
      amount_invested = amount_invested + amount_investing;
      number_of_shares = number_of_shares + (amount_investing / el.adjClose);
      if (last_close > el.adjClose && (last_close - el.adjClose) > lowest_close_from_last) {
        lowest_close_from_last = (last_close - el.adjClose);
        lowest_close_from_last_date = el.date;
      }
      last_close = el.adjClose;
    }
  });

  if (new_data.length == 0) {
    console.log(no_data_found_2);
    throw no_data_found_2;
  }
  else {
    console.log("Required Data Extracted: ", new_data.length, " rows");
  }

  let supplementaryData = await yahooFinance.quote({
      symbol: ticker,
      modules: ['defaultKeyStatistics']
    });
  console.log("defaultKeyStatistics =", supplementaryData.defaultKeyStatistics);
  try {
    oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    //console.log("oneDay");
    first_date = new Date(new_data[0].date);
    //console.log("first_date");
    last_date = new Date(new_data[new_data.length - 1].date);
    //console.log("last_date");
    last_price = Number(new_data[new_data.length - 1].adjClose);
    //console.log("last_price");
    days_invested = Math.round(Math.abs((last_date - first_date) / oneDay));
    //console.log("days_invested:", days_invested");
    years_invested = Number(days_invested / 365);
    //console.log("years_invested:", years_invested);
    current_value = number_of_shares * last_price;
    //console.log("current_value");
    avg_price_per_share = amount_invested / number_of_shares;
    //console.log("avg_price_per_share");
    total_gain = (current_value - amount_invested) / amount_invested * 100;
    //console.log("total_gain:", total_gain);
    performance_pa = total_gain / years_invested;
    //console.log("performance_pa:", performance_pa);
    graham_value_price = (22.5 * supplementaryData.defaultKeyStatistics.trailingEps *  supplementaryData.defaultKeyStatistics.bookValue);
    //console.log("graham_value_price:", graham_value_price, " = ", supplementaryData.defaultKeyStatistics.forwardEps, " * ",  supplementaryData.defaultKeyStatistics.bookValue);
    
    
    let returnData = {
      "ticker": ticker,
      "start_date": new Date(first_date).toDateString(),
      "end_date": new Date(last_date).toDateString(),
      "period": period,
      "lowest_close_from_last_date": new Date(lowest_close_from_last_date).toDateString(),
      "stop_loss": lowest_close_from_last.toFixed(2),
      "avg_price_per_share": avg_price_per_share.toFixed(2),
      "last_price": last_price.toFixed(2),
      "amount_invested": amount_invested.toFixed(2),
      "current_value": current_value.toFixed(2),
      "total_gain": total_gain.toFixed(2),
      "performance_pa": performance_pa.toFixed(2),
      "graham_value_price": graham_value_price.toFixed(2),
      "data_rows": new_data
    }
    //console.log(returnData);
    return returnData;
  }
  catch (e) {
    console.log(e);
    return {};
  }
}

function writeSearchLog(text) {
  fs.writeFile('search_log.txt', text, function(err) {
    if (err) return console.log(err);
    console.log('logged:', text);
  });
}

module.exports = router;