const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

const db = require('./models');
dotenv.config();

const crawler = async () => {
  try{
    await db.sequelize.sync();
    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ["--window-size=1920,1080", "--disable-notifications"],
        userDataDir: './data'
     });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1080,
        height: 1080
    });
    //await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36');
    const id = process.env.ID;
    const password = process.env.PASSWORD;
    await page.goto('https://instagram.com');
    await page.waitForTimeout(2000);
    if (await page.$('[href="/rraamm_m/"]')) {
      console.log('이미 로그인 되어 있습니다.');
    } else {
        await page.waitForSelector('button.y3zKF')
        await page.type('[name="username"]', process.env.ID);
        await page.type('[name="password"]', process.env.PASSWORD);
        await page.waitForTimeout(1000);
        //await page.click('#loginbutton');
        await page.keyboard.press('Enter');
        await page.waitForSelector('.cmbtv button');
        await page.click('.cmbtv button');
        
        //await page.waitForNavigation(); // 페이스북 로그인 페이지로 넘어가는 것을 기다림 
        console.log('로그인을 완료 했습니다.')
    }
/*     await page.waitForSelector('input[aria-label="입력 검색"]');
    await page.type('input[aria-label="입력 검색"]', 'test');
    // page.keyboard.type 도 가능할듯.
    await page.waitForSelector('._abn- a');

    const href = await page.evaluate(() => {
      return document.querySelector('._abn- a').href
    });
    await page.goto(href);
 */
    // 밑의 코드도 가능
    // await page.click('._abn- a');
    
    await page.waitForSelector('article ._abm0._abl_ svg[aria-label="댓글 달기"]')
    //await page.click('article ._abm0._abl_ svg[aria-label="댓글 달기"]')
    
    await page.waitForTimeout(2000);

    const comments = await page.evaluate(async () => {
      document.querySelector('article ._aamx ._abl-').click();
      await new Promise(function(resolve) { 
        setTimeout(resolve, 3000)
      });
      const commentTags = document.querySelectorAll('ul ul li ._a9zr');

      let result = [];
      if(commentTags){
        Array.from(commentTags).forEach((c) => {
          const name = c.querySelector('h3').textContent;
          const comment = c.querySelector('._a9zs').textContent;
          result.push({name, comment});
        });       
      }
      return result
    })
    console.log(comments)
    await db.sequelize.close();
  } catch (e) {
    console.error(e);
  }
}

crawler();