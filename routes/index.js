const yahooFinance = require('yahoo-finance');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Fin Tool' });
});

router.get('/result', (req, res) => {
  var ticker = req.query.ticker;
  var from_date = req.query.start_date;
  var to_date = req.query.end_date
  var period = req.query.period;
  var rows = [];
  yahooFinance.historical({
    symbol: ticker,
    from: from_date,
    to: to_date,
    period: period
  }, 
  function(err, quotes) 
  {
    if (quotes.length != 0) 
    { rows = sip_performance(ticker, period, quotes, 50);
     res.render('performance', { "rows": rows }); }
  });
})


function sip_performance(ticker, period, data, amount_investing) {
  amount_invested = 0;
  number_of_shares = 0;
  data.forEach(el => {
    amount_invested = amount_invested + amount_investing;
    number_of_shares = number_of_shares + (amount_investing / el.adjClose);
  });
  oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  last_date = data[0].date;
  first_date = data[data.length - 1].date;
  days_invested = Math.round(Math.abs((last_date - first_date) / oneDay));
  years_invested = days_invested / 365;
  last_price = data[0].adjClose;
  current_value = number_of_shares * last_price;
  total_gain = (current_value - amount_invested) / amount_invested * 100;
  performance_pa = total_gain / years_invested;
  return [{
    "ticker": ticker,
    "start_date": new Date(first_date).toLocaleString('en-us'),
    "end_date": new Date(last_date).toLocaleString('en-us'), 
    "period": period, 
    "total_gain": total_gain,
    "performance_pa": performance_pa
  }]
}


module.exports = router;