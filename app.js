const express = require('express');
const path = require('path');
const Config = require('config');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');

const app = express();

const crawling = require('./libs/crawling/index.js');
const blockBuilder = require('./libs/block_builder');
const libKakaoWork = require('./libs/kakaoWork');
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
  console.log("data update finish, update time : UTC(0)_",new Date().toLocaleString());
}

// 새로운 강의들을 찾고, 있으면 알림을 보냄.
// 혹시 알림이 안간다면 너무 많은 강의들이 있어서 send 에 실패했을 수 있음.
async function getNewLectures() {
	const axios = require('axios');	
	const test = axios.create({
		baseURL: Config.baseUrl,
	});
	let result = await test.get('/new-lecture');
	let lectures = result.data;
	
	// 새로운 강의가 없으면 종료.
	if (lectures.length == 0) {
		return;
	}
	const users = await libKakaoWork.getUserList();
	const converations = await Promise.all(
		users.map((u) => libKakaoWork.openConversations({userId: u.id}))
	);
	await Promise.all([
		converations.map((c) => libKakaoWork.sendMessage(
			blockBuilder.newlecture_block_sender(lectures, c.id)
		))
	]);
}

// start 하고 10분 지나야 실행됨.
console.log("server open time : UTC(0)_",new Date().toLocaleString());
setInterval(async function(){
	await updateData();
	await getNewLectures();
},1000*60*10);

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));

module.exports = app;