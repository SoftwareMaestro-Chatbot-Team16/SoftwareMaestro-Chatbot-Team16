const Config = require('config');
const baseUrl = Config.baseUrl;
const request = require('request');
const libKakaoWork = require('../kakaoWork');

// Construct select_menu_block (mentor / mentee / class)
function block_select_menus(id) {
	let block = {
	  "conversationId": id, // default value.
	  "text": "소마12기 검색봇",
	  "blocks": [
		{
		  "type": "header",
		  "text": "소마12기 검색봇",
		  "style": "yellow"
		},
		{
		  "type": "image_link",
		  "url": "https://as1.ftcdn.net/jpg/02/48/32/46/500_F_248324676_WtiYuVi0L3ZD0bW3Wfv7yrQJwWbbp69C.jpg"
		},
		{
		  "type": "button",
		  "action_type": "call_modal",
		  "value": "mentee",
		  "text": "연수생 검색",
		  "style": "primary"
		},
		{
		  "type": "button",
		  "action_type": "call_modal",
		  "value": "mentor",
		  "text": "멘토 검색",
		  "style": "danger"
		},
		{
		  "type": "button",
		  "action_type": "call_modal",
		  "value": "class",
		  "text": "특강 검색",
		  "style": "default"
		}
	  ]
	}
	return block;
}

function modal_search_mentee() {
	let modal = {
	  "title": "연수생 검색",
	  "accept": "확인",
	  "decline": "취소",
	  "value": "search_mentee",
	  "blocks": [
		{
		  "type": "label",
		  "text": "검색하고 싶은 관심기술을 *1개* 선택해주세요!",
		  "markdown": true
		},
		{
		  "type": "select",
		  "name": "tech",
		  "options": [
			{
			  "text": "FRONT-END",
			  "value": "FRONT-END"
			},
			{
			  "text": "BACK-END",
			  "value": "BACK-END"
			},
			{
			  "text": "디바이스",
			  "value": "디바이스"
			},
			{
			  "text": "SW",
			  "value": "SW"
			},
			{
			  "text": "AI",
			  "value": "AI"
			},
			{
			  "text": "블록체인/융합",
			  "value": "블록체인/융합"
			},
			{
			  "text": "방송/컨텐츠",
			  "value": "방송/컨텐츠"
			},
			{
			  "text": "미래전파/통신",
			  "value": "미래전파/통신"
			},
			{
			  "text": "차세대보안",
			  "value": "차세대보안"
			}
		  ],
		  "required": true,
		  "placeholder": "관심기술"
		}
	  ]
	};
	return modal;
}

function modal_search_mentor() {
	let modal = {
		  "title": "멘토 검색",
		  "accept": "확인",
		  "decline": "취소",
		  "value": "search_mentor",
		  "blocks": [
			{
			  "type": "label",
			  "text": "📌 각 항목에 대해서 *최대 1개씩* 선택할 수 있습니다.",
			  "markdown": true
			},
			{
			  "type": "select",
			  "name": "tech",
			  "options": [
				{
				  "text": "FRONT-END",
				  "value": "FRONT-END"
				},
				{
				  "text": "BACK-END",
				  "value": "BACK-END"
				},
				{
				  "text": "디바이스",
				  "value": "디바이스"
				},
				{
				  "text": "SW",
				  "value": "SW"
				},
				{
				  "text": "AI",
				  "value": "AI"
				},
				{
				  "text": "블록체인/융합",
				  "value": "블록체인/융합"
				},
				{
				  "text": "방송/컨텐츠",
				  "value": "방송/컨텐츠"
				},
				{
				  "text": "미래전파/통신",
				  "value": "미래전파/통신"
				},
				{
				  "text": "차세대보안",
				  "value": "차세대보안"
				}
			  ],
			  "required": false,
			  "placeholder": "기술/관심기술"
			},
			{
			  "type": "select",
			  "name": "non_tech",
			  "options": [
				{
				  "text": "기획/사업화",
				  "value": "기획/사업화"
				},
				{
				  "text": "특허/법률",
				  "value": "특허/법률"
				},
				{
				  "text": "재무/회계",
				  "value": "재무/회계"
				}
			  ],
			  "required": false,
			  "placeholder": "비기술"
			},
			{
			  "type": "select",
			  "name": "sw",
			  "options": [
				{
				  "text": "응용SW",
				  "value": "응용SW"
				},
				{
				  "text": "시스템SW",
				  "value": "시스템SW"
				},
				{
				  "text": "클라우드컴퓨팅",
				  "value": "클라우드컴퓨팅"
				},
				{
				  "text": "컴퓨팅시스템",
				  "value": "컴퓨팅시스템"
				}
			  ],
			  "required": false,
			  "placeholder": "SW"
			},
			{
			  "type": "select",
			  "name": "ai",
			  "options": [
				{
				  "text": "인공지능",
				  "value": "인공지능"
				},
				{
				  "text": "빅데이터",
				  "value": "빅데이터"
				}
			  ],
			  "required": false,
			  "placeholder": "AI"
			},
			{
			  "type": "select",
			  "name": "device",
			  "options": [
				{
				  "text": "웨어러블",
				  "value": "웨어러블"
				},
				{
				  "text": "지능형디바이스",
				  "value": "지능형디바이스"
				},
				{
				  "text": "지능형반도체",
				  "value": "지능형반도체"
				},
				{
				  "text": "스마트자동차",
				  "value": "스마트자동차"
				},
				{
				  "text": "3D프린팅",
				  "value": "3D프린팅"
				}
			  ],
			  "required": false,
			  "placeholder": "디바이스"
			},
			{
			  "type": "select",
			  "name": "blockchain",
			  "options": [
				{
				  "text": "블록체인",
				  "value": "블록체인"
				},
				{
				  "text": "ICT융합서비스",
				  "value": "ICT융합서비스"
				},
				{
				  "text": "사물인터넷",
				  "value": "사물인터넷"
				}
			  ],
			  "required": false,
			  "placeholder": "블록체인"
			},
			{
			  "type": "select",
			  "name": "security",
			  "options": [
				{
				  "text": "시스템/암호보안",
				  "value": "시스템/암호보안"
				},
				{
				  "text": "네트워크보안",
				  "value": "네트워크보안"
				},
				{
				  "text": "물리보안",
				  "value": "물리보안"
				},
				{
				  "text": "융합보안",
				  "value": "융합보안"
				},
				{
				  "text": "데이터 및 응용서비스 보안",
				  "value": "데이터 및 응용서비스 보안"
				}
			  ],
			  "required": false,
			  "placeholder": "차세대보안"
			},
			{
			  "type": "select",
			  "name": "media",
			  "options": [
				{
				  "text": "방송/스마트미디어",
				  "value": "방송/스마트미디어"
				},
				{
				  "text": "디지털컨텐츠",
				  "value": "디지털컨텐츠"
				},
				{
				  "text": "콘텐츠/미디어인프라",
				  "value": "콘텐츠/미디어인프라"
				}
			  ],
			  "required": false,
			  "placeholder": "방송/컨텐츠"
			},
			{
			  "type": "select",
			  "name": "radio",
			  "options": [
				{
				  "text": "차세대통신",
				  "value": "차세대통신"
				},
				{
				  "text": "양자정보통신",
				  "value": "양자정보통신"
				},
				{
				  "text": "전파/위성",
				  "value": "전파/위성"
				}
			  ],
			  "required": false,
			  "placeholder": "미래전파"
			}
		  ]
	};
	return modal;
}

function modal_search_class() {
	let modal = {
	  "title": "멘토링 검색",
	  "accept": "확인",
	  "decline": "취소",
	  "value": "search_class",
	  "blocks": [
		{
		  "type": "label",
		  "text": "👏 *멘토링의 제목* 또는 *멘토님의 성함*으로 검색이 가능합니다.",
		  "markdown": true
		},
		{
		  "type": "select",
		  "name": "search_type",
		  "options": [
			{
			  "text": "멘토링 제목",
			  "value": "title"
			},
			{
			  "text": "멘토님 성함",
			  "value": "name"
			}
		  ],
		  "required": true,
		  "placeholder": "옵션을 선택해주세요"
		},
		{
		  "type": "input",
		  "name": "value",
		  "required": true,
		  "placeholder": "내용을 입력해주세요"
		}
	  ]
	}
	return modal;
}

function mentee_block_sender (name, tech, conversationId) {
	let block = [
		{
		  "type": "header",
		  "text": "연수생 검색 결과",
		  "style": "blue"
		},
		constructText(`*${tech}*에 관심있는 연수생들을 찾아봤어요.`, true),
		{"type": "divider"},
		constructText(`*${name}*`, true),
	  ]

	let block_msg = {
	  "conversationId": conversationId,
	  "text": "연수생 검색 결과",
	  "blocks": block
	}

	return block_msg;
}

function search_mentee (actions, conversationId) {
	const url = baseUrl + `/user?tech=${encodeURIComponent(actions.tech)}`;
	
	// request 에 등록한 콜백 함수가 메시지를 보내는 작업을 하는데,
	// 이를 기다리기 위해서 Promise 를 리턴함.
	// 사용할 때 await 해주면 됨.
	// ref: https://senticoding.tistory.com/42
	return [new Promise(resolve => {
		request(url, (err, response, body) => {
			let result = [];
			const parsed_body = JSON.parse(body);
			for(var v of parsed_body) {
				let msg = mentee_block_sender (
					v.name, actions.tech, conversationId
				);
				result.push(libKakaoWork.sendMessage(msg));
			}
			resolve(result);
		});
	})];
}

function constructDescription(term, text, markdown=false) {
	return {
	  "type": "description",
	  "term": term,
	  "content": {
		"type": "text",
		"text": text,
		"markdown": markdown
	  },
	  "accent": true
	}
}

function constructText(text, markdown=false) {
	return {
      "type": "text",
      "text": text,
      "markdown": markdown
    }
}

function class_block_sender (lecture, actions, conversationId) {
	let infoMsg = actions.search_type == "name" ? 
		`*${actions.value}* 멘토님이 여시는 멘토링을 모아봤어요.` :
		`제목에 *${actions.value}* 가 들어가는 멘토링을 모아봤어요.`;

	let block = [
		{
		  "type": "header",
		  "text": "멘토링 검색 결과",
		  "style": "yellow"
		},
		{
		  "type": "text",
		  "text": infoMsg,
		  "markdown": true
		},
		{
		  "type": "divider"
		},
		constructText(lecture.title),
		constructDescription("일시", lecture.lecture_day),
		constructDescription("멘토님", lecture.name),
		constructDescription("현재 접수인원", lecture.people),
  	];

	
	let block_msg = {
	  "conversationId": conversationId,
	  "text": "멘토링 검색 결과",
	  "blocks": block
	}
	return block_msg;
}

function search_class (actions, conversationId) {
	let url;
	url  = baseUrl;
	url += `/lecture?filter=${encodeURIComponent(actions.search_type)}`;
	url += `&keyword=${encodeURIComponent(actions.value)}`;
	return [new Promise(resolve => {
		request(url, (err, response, body) => {
			let result = [];
			const parsed_body = JSON.parse(body);
			for(var lecture of parsed_body) {
				let msg = class_block_sender (
					lecture, actions, conversationId
				);
				result.push(libKakaoWork.sendMessage(msg));
			}
			resolve(result);
		});
	})];
}


exports.block_select_menus = block_select_menus;
exports.modal_search_mentee = modal_search_mentee;
exports.modal_search_mentor = modal_search_mentor;
exports.modal_search_class = modal_search_class;
exports.search_mentee = search_mentee;
exports.search_class = search_class;