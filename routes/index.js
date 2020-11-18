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
  var period = req.query.period;
  var amount = parseInt(req.query.amount);
  yahooFinance.historical({
    symbol: ticker,
    from: from_date,
    to: to_date,
    period: "d"
  }, 
  function(err, quotes) 
  {
    if (quotes.length != 0) 
    {
      res.render('performance', sip_performance(ticker, from_date, period, quotes.reverse(), amount)) 
    }
    else
    {
      res.render('performance', {"rows": [], "data_rows": []})
    }
  });
})


function sip_performance(ticker, from_date, period, data, amount_investing) {
  amount_invested = 0;
  number_of_shares = 0;
  day_of_investing = new Date(from_date).getDay();

  new_data = [];
  data.forEach(el => {
    if(period == "d" || (period == "w" && new Date(el.date).getDay() == day_of_investing))
    {
    new_data.push(el);
    amount_invested = amount_invested + amount_investing;
    number_of_shares = number_of_shares + (amount_investing / el.adjClose);
    }
  });
  
  oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  first_date = new_data[0].date;
  last_date = new_data[new_data.length - 1].date;
  last_price = new_data[new_data.length - 1].adjClose;
  days_invested = Math.round(Math.abs((last_date - first_date) / oneDay));
  years_invested = days_invested / 365;
  current_value = number_of_shares * last_price;
  total_gain = (current_value - amount_invested) / amount_invested * 100;
  performance_pa = total_gain / years_invested;
  return {"rows": [{
    "ticker": ticker,
    "start_date": new Date(first_date).toDateString(),
    "end_date": new Date(last_date).toDateString(), 
    "period": period, 
    "amount_invested": amount_invested,
    "current_value": current_value,
    "total_gain": total_gain,
    "performance_pa": performance_pa
  }],
  "data_rows": new_data}
}


module.exports = router;