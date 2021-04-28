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
	return res.data.message;
}

sendMessageToEveryUsers = async () => {
	const users = await getUserList();
	const conversations = await Promise.all(
		users.map((u) => openConversations({ userId: u.id }))
	);
	
	const messages = await Promise.all([
		conversations.map((c) => sendMessage(
			blockBuilder.block_select_menus(c.id)
		))
	]);
	
	return {users, conversations, messages};
}

exports.getUserList = getUserList;
exports.openConversations = openConversations;
exports.sendMessage = sendMessage;
exports.sendMessageToEveryUsers = sendMessageToEveryUsers;