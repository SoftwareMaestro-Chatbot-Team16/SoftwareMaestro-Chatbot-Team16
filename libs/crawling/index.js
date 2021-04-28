module.exports.extractData = print_extractData;

// module
const puppeteer = require('puppeteer');
const fs = require('fs');

// needData
const info = JSON.parse(fs.readFileSync('./configs/loginInfo/infoConfig.json','utf-8'));
const loginPage_url = "https://swmaestro.org/sw/member/user/forLogin.do?menuNo=200025";
const mentoringPage_url = "https://swmaestro.org/sw/mypage/mentoLec/list.do?menuNo=200046";
const memberPage_url = "https://swmaestro.org/sw/mypage/myTeam/teamPropose.do?viewType=CONTBODY";
const mentorPage_url = "https://swmaestro.org/sw/mypage/myTeam/mentoPropose.do?viewType=CONTBODY";

async function getAllUsers(page){
    let result = {};
    await page.waitForTimeout(500);
    const number = await page.$$eval(`#searchList > div > table > tbody > tr`,(data)=>data.length);
    for(let i=0 ;i < number; i++){
        let t1 = await page.$(`#searchList > div > table > tbody > tr:nth-child(${i+1}) > td:nth-child(1)`);
        let t2 = await page.$(`#searchList > div > table > tbody > tr:nth-child(${i+1}) > td:nth-child(2)`);
        let t3 = await page.$(`#searchList > div > table > tbody > tr:nth-child(${i+1}) > td:nth-child(4)`);
        let no = await page.evaluate((data)=>{ return data.textContent; },t1);
        let name = await page.evaluate((data)=>{ return data.textContent;},t2);
        let tech = await page.evaluate((data)=>{ return data.textContent;},t3);
        result[no] = {
            "name" : name.replace(/(^\s*)|(\s*$)/g,""),
            "tech" : tech.trim().split(',')
        }
    }
    return Promise.resolve(result);
}

// all data extract
async function getAll(page){
    let result = [];
    if (await page.$(`.nodata`) === null){
        const number = await page.$$eval(`#contentsList > div > div > div > table > tbody > tr`,(data)=>data.length);
        for(let i = 0; i < number ;i++){
            result.push(await getOne(page,i+1));
        }
    }
    return Promise.resolve(result);
}
// one data extract
async function getOne(page, index){
    let result = {};
    let temp = await page.$(`#contentsList > div > div > div > table > tbody > tr:nth-child(${index}) > td.tit > div.rel > a`);
    result.title = await page.evaluate((data)=>{ return data.textContent; },temp);

    temp = await page.$(`#contentsList > div > div > div > table > tbody > tr:nth-child(${index}) > td:nth-child(1)`);
    result.no = await page.evaluate((data)=>{ return data.textContent; },temp);

    temp = await page.$(`#contentsList > div > div > div > table > tbody > tr:nth-child(${index}) > td:nth-child(3)`);
    result.duration = await page.evaluate((data)=>{ return data.textContent; },temp);

    temp = await page.$(`#contentsList > div > div > div > table > tbody > tr:nth-child(${index}) > td:nth-child(4)`);
    result.lecture_day = await page.evaluate((data)=>{ return data.textContent; },temp);

    temp = await page.$(`#contentsList > div > div > div > table > tbody > tr:nth-child(${index}) > td:nth-child(5)`);
    result.people = await page.evaluate((data)=>{ return data.textContent; },temp);

    temp = await page.$(`#contentsList > div > div > div > table > tbody > tr:nth-child(${index}) > td:nth-child(6)`);
    result.status = await page.evaluate((data)=>{ return data.textContent; },temp);

    temp = await page.$(`#contentsList > div > div > div > table > tbody > tr:nth-child(${index}) > td:nth-child(7)`);
    result.name = await page.evaluate((data)=>{ return data.textContent; },temp);

    temp = await page.$(`#contentsList > div > div > div > table > tbody > tr:nth-child(${index}) > td:nth-child(8)`);
    result.day = await page.evaluate((data)=>{ return data.textContent; },temp);

    return Promise.resolve(result);
}
// main function
async function print_extractData(){
    const browser = await puppeteer.launch({
		args : ['--no-sandbox', '--disable-setuid-sandbox'],
	});
    const page = await browser.newPage();
    page.on('dialog', async dialog => {
        console.log(`dialog message:' ${dialog.message()}`);
        await dialog.dismiss();
    });
    let result = {};

    //goto Login Page
    await page.goto(loginPage_url);

    //try Login
    await page.evaluate((id, pw) => {
        document.querySelector('input[name="username"]').value = id;
        document.querySelector('input[name="password"]').value = pw;
    }, info.id, info.pw);
    await page.click('button[type="submit"]');

    //wait login
    await page.waitForTimeout(500);

    //login Failure
    if(page.url() === loginPage_url){
        console.log("failure");
    }

    // login Success
    else{
        console.log("success");

        let users = {};
        let mentors = {};
        let lectures = [];

        // goto MyPage
        const limit = 1000;
        for(var i=0;i<limit;i++){
            console.log(i+1);
            await page.goto(mentoringPage_url+`&pageIndex=${i+1}`);

            // extract all data
            data = await getAll(page);
            if(data.length===0) break;
            for(j of data) lectures.push(j);
        }

        // goto MemberPage;
        await page.goto(memberPage_url);
        tempData = await getAllUsers(page);
        tempData[176] = { "name" : "송기연", "tech": ["FRONT-END","SW"]};
        users = tempData;

        // goto MentorPage;
        await page.goto(mentorPage_url);
        tempData = await getAllUsers(page);
        mentors = tempData;

        result.users = users;
        result.mentors = mentors;
        result.lectures = lectures;

		console.log("all page crawling!");
    }
    await browser.close();
    return Promise.resolve(result);
}