// routes/index.js
const express = require('express');
const router = express.Router();
const Config = require('config');

const libKakaoWork = require('../libs/kakaoWork');
const fs = require('fs');
const blockBuilder = require('../libs/block_builder');
var data = JSON.parse(fs.readFileSync('./configs/data/data.json','utf-8'));

router.get('/', async (req, res, next) => {
	const users = await libKakaoWork.getUserList();
	const converations = await Promise.all(
		users.map((u) => libKakaoWork.openConversations({userId: u.id}))
	);
	const messages = await Promise.all([
		converations.map((c) => libKakaoWork.sendMessage(
			blockBuilder.block_select_menus(c.id)
		))
	])
	res.send(users);
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
	switch (value) {
		case 'search_mentee':
			await Promise.all(
				blockBuilder.search_mentee (actions, conversation_id)
			);
			break;
		case 'search_mentor':
			await Promise.all(
				blockBuilder.search_mentor (actions, conversation_id)
			);
		break;
		case 'search_class':
			await Promise.all(
				blockBuilder.search_class (actions, conversation_id)
			);
		break;
	}
	res.json({result: true});

	setTimeout((id) => libKakaoWork.sendMessage(
		blockBuilder.block_select_menus(id)
	), 2000, conversation_id);
})

router.get('/user', (req, res, next) => {
	const tech = decodeURIComponent(req.query.tech);
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

router.get('/new-lecture', async(req, res, next) => {
	const now = data.now.lectures;
	const prev = data.prev.lectures;

	var chk = {};
	var result = [];
	for(i of prev){
		chk[i.no] = 1;
	}
	for(i of now){
		if(chk[i.no]===undefined) result.push(i);
	}
	res.send(result);
})

module.exports = router;