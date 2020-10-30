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
  console.log(req);
  yahooFinance.historical({
    symbol: req.body.ticker_search,
    from: req.body.start_date,
    to: req.body.end_date,
    period: req.body.period
  }, function(err, quotes) {
    res.send(sip_performance(quotes));
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


function sip_performance(data)
{
  return data
}