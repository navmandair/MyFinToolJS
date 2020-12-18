const yahooFinance = require('yahoo-finance');
const express = require('express');
const DataProvider = require('../data_provider.js');
const router = express.Router();

/* GET ticker */
router.get('/search', function(req, res, next) {
  try
  {
    let result = []
    const searchKey = req.query.search_key;
    if(searchKey) {
      result = DataProvider.searchTicker(searchKey, function(response){
        console.log(response.bestMatches);
        res.send(response.bestMatches);
      });
    }
  }
  catch(e)
  {
    console.log(e);
  }
});


module.exports = router;