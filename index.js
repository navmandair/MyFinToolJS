const yahooFinance = require('yahoo-finance')
const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/Views/" + "index.html");
})

app.post('/result', (req, res) => {
  yahooFinance.historical({
    symbol: req.body.ticker_search,
    from: req.body.start_date,
    to: req.body.end_date,
    period: req.body.period
  }, function(err, quotes) {
    res.send(sip_performance(quotes, 50));
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


function sip_performance(data, amount_investing) {
  amount_invested = 0;
  number_of_shares = 0;
  data.forEach(el =>
  { 
    amount_invested = amount_invested + amount_investing
    number_of_shares = number_of_shares + amount_investing/el.adjClose;
  })
  current_value = number_of_shares * data[data.length-1].adjClose;
  total_gain = current_value - amount_invested
  return {"total_gain":total_gain}
}