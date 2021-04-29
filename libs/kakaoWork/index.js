const Config = require('config');

const axios = require('axios');
const kakaoInstance = axios.create({
	baseURL : 'https://api.kakaowork.com',
	headers: {
		Authorization: `Bearer ${Config.keys.kakaoWork.bot}`,
	}
});

exports.getUserList = async () => {
	result = [];
	const res = await kakaoInstance.get('/v1/users.list?limit=100');
	const pageCursor = res.data.cursor;
	const nxtRes = await kakaoInstance.get(`/v1/users.list?cursor=${pageCursor}`);
	result = res.data.users;
	for(var i=0; i<nxtRes.data.users.length;i++){
		result.push(nxtRes.data.users[i]);
	}
	return Promise.resolve(result);
}
// 채팅방 생성
exports.openConversations = async({ userId }) => {
	const data = {
		user_id : userId
	};
	
	const res = await kakaoInstance.post('/v1/conversations.open', data);
	return res.data.conversation;
}

// 메시지 전송
exports.sendMessage = async ({ conversationId, text, blocks }) => {
	const data = {
		conversation_id: conversationId,
		text,
		...blocks && { blocks }
	};
	
	const res = await kakaoInstance.post('/v1/messages.send', data);
	return res.data.message;
}