const express = require('express')
const path = require('path');
const app = express();
const indexRouter = require('./routes/index');
const tickerRouter = require('./routes/ticker');
const dotenv = require('dotenv');
const result = dotenv.config({ path: path.join(__dirname, 'custom.env')});
if (result.error) {
  throw result.error
}

app.use('/', indexRouter);
app.use('/ticker', tickerRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.engine('pug', require('pug').__express)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});



module.exports = app;