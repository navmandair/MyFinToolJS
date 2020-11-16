const yahooFinance = require('yahoo-finance');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/result', (req, res) => {
  yahooFinance.historical({
    symbol: req.query.ticker_search,
    from: req.query.start_date,
    to: req.query.end_date,
    period: req.query.period
  }, function(err, quotes) {
    if(quotes.length != 0)
      {res.send(sip_performance(quotes, 50));}
    else
      {res.send({})}
  });
  
})


function sip_performance(data, amount_investing) {
  amount_invested = 0;
  number_of_shares = 0;
  data.forEach(el =>
  { 
    amount_invested = amount_invested + amount_investing;
    number_of_shares = number_of_shares + (amount_investing/el.adjClose);
  });
  oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  last_date = data[0].date;
  first_date = data[data.length-1].date;
  days_invested = Math.round(Math.abs((last_date - first_date) / oneDay));
  years_invested = days_invested/365;
  last_price = data[0].adjClose;
  current_value = number_of_shares * last_price;
  total_gain = (current_value - amount_invested)/amount_invested * 100;
  performance_pa = total_gain/years_invested;
  return {"first_date":first_date, "last_date":last_date, "years_invested": years_invested,"performance_pa":performance_pa}
}


module.exports = router;