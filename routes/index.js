// routes/index.js
const express = require('express');
const router = express.Router();
const Config = require('config');

const libKakaoWork = require('../libs/kakaoWork');
const blockBuilder = require('../libs/block_builder');
const fs = require('fs');

var data = JSON.parse(fs.readFileSync('./configs/data/data.json','utf-8'));

router.get('/', async (req, res, next) => {
	let select_block = blockBuilder.block_select_menus();
	var {users, conversations, messages} = await libKakaoWork.sendMessageToEveryUsers(select_block);
	
	res.send("OK");
});

router.post('/request', async (req, res, next) => {
	const {message, value} = req.body;
	switch (value) {
		case 'mentee':
			return res.json({
				view: blockBuilder.modal_search_mentee()
			})
			break;
		case 'mentor':
			return res.json({
				view: blockBuilder.modal_search_mentor()
			})
			break;
		case 'class':
			return res.json({
				view: blockBuilder.modal_search_class()
			})
			break;
	}
})

router.post('/callback', async (req, res, next) => {
	const {action_time, actions, message, value} = req.body;
	const conversation_id = message.conversation_id;
	console.log(req.body);
	switch (value) {
		case 'search_mentee':
			await Promise.all(
				await blockBuilder.search_mentee (actions, conversation_id)
			);
			break;
		case 'search_mentor':
			// TODO
		break;
		case 'search_class':
			await Promise.all(
				await blockBuilder.search_class (actions, conversation_id)
			);
		break;
	}
})

router.get('/user', (req, res, next) => {
	const tech = decodeURIComponent(req.query.tech);
	console.log("<<", tech);
	if(!tech) {
		res.sendStatus(400);
	}  
	const users = Object.values(data.now.users);
	const result = users.filter(user => 
		user.tech.includes(tech)
    );
	res.send(result);
});

router.get('/mentor', (req, res, next) => {
	const techs = decodeURIComponent(req.query.techs).split(",");
	
	if(!techs) {
		res.sendStatus(400);
	}  
	
	const mentors = Object.values(data.now.mentors);
	const result = mentors.filter(mentor => {
		for(const tech of techs) {
			const isIncluded = mentor.tech.includes(tech);
			if(!isIncluded) {
				return false;
			}
		}
		return true;
	});
	res.send(result);
});

router.get('/lecture', async (req, res, next) => {
	// lecture 는 자주 변동이 일어나기 때문에, data.json 에서 새로 읽어옵니다.
	// user 나 mentor 의 정보는 거의 변동이 일어나지 않기 때문에, 이전에 읽어온 데이터를 그대로 사용합니다.
	data = JSON.parse(fs.readFileSync('./configs/data/data.json','utf-8'));
	const filter = req.query.filter || "title";
	const keyword = req.query.keyword;

	if(!keyword) {
		res.sendStatus(400);
	}
	
	const lectures = Object.values(data.now.lectures);
	const result = lectures.filter(lecture => 
		lecture[filter].includes(keyword)
	);
	res.send(result);
});

module.exports = router;