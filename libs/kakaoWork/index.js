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
	
	// 인원이 100명 이하인 테스트용 워크 스페이스에서는 바로 리턴시킴
	if (!pageCursor) {
		return res.data.users;
	}
	const nxtRes = await kakaoInstance.get(`/v1/users.list?cursor=${pageCursor}`);
	return res.data.users.concat(nxtRes.data.users);
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