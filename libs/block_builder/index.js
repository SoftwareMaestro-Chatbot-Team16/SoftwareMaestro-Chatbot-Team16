// Construct select_menu_block (mentor / mentee / class)
function block_select_menus(conversation_id) {
	let block = {
	  "conversationId": conversation_id,
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

exports.block_select_menus = block_select_menus;