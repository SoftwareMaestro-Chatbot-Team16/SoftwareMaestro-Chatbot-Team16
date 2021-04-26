const express = require('express');
const path = require('path');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');

const app = express();

const crawling = require('./libs/crawling/index.js');
const fs = require('fs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ err });
});

async function updateData(){
  console.log("data update start");
  let data = await crawling.extractData();
  let origin = JSON.parse(fs.readFileSync('./configs/data/data.json','utf-8'));
  origin["prev"] = origin["now"];
  origin["now"] = data;
  fs.writeFileSync('./configs/data/data.json',JSON.stringify(origin));
  console.log("data update finish");
}

// init data;
updateData();
setInterval(function(){
	updateData();
},1000*60*10);

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;
