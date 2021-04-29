const Config = require('config');

const axios = require('axios');
const blockBuilder = require('../block_builder');
const kakaoInstance = axios.create({
	baseURL : 'https://api.kakaowork.com',
	headers: {
		Authorization: `Bearer ${Config.keys.kakaoWork.bot}`,
	}
});

getUserList = async () => {
	const res = await kakaoInstance.get('/v1/users.list');
	return res.data.users;
}
// 채팅방 생성
openConversations = async({ userId }) => {
	const data = {
		user_id : userId
	};
	
	const res = await kakaoInstance.post('/v1/conversations.open', data);
	return res.data.conversation;
}

// 메시지 전송
sendMessage = async ({ conversationId, text, blocks }) => {
	const data = {
		conversation_id: conversationId,
		text,
		...blocks && { blocks }
	};
	
	const res = await kakaoInstance.post('/v1/messages.send', data);
	console.log(res);
	return res.data.message;
}

// 모두에게 동일한 msg 를 보냄.
sendMessageToEveryUsers = async (msg) => {
	// TODO: kakao api 에서 디폴트로는 10명이 한계이기 때문에, 수정이 필요함.
	const users = await getUserList();

	const conversations = await Promise.all(
		users.map((u) => openConversations({ userId: u.id }))
	);
	
	const messages = await Promise.all([
		conversations.map((c) => {
			msg['conversationId'] = c.id;
			sendMessage(msg);
		})
	]);
	
	return {users, conversations, messages};
}

exports.getUserList = getUserList;
exports.openConversations = openConversations;
exports.sendMessage = sendMessage;
exports.sendMessageToEveryUsers = sendMessageToEveryUsers;