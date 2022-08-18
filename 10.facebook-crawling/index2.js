const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

const db = require('./models');
dotenv.config();

const crawler = async () => {
  try{
    await db.sequelize.sync();
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1920,1080", "--disable-notifications"] });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1080,
        height: 1080
    });
    const id = process.env.ID;
    const password = process.env.PASSWORD;
    await page.goto('https://facebook.com');
    await page.type('#email', process.env.ID);
    await page.type('#pass', process.env.PASSWORD);
    //await page.waitForTimeout(2000);
    await page.click('._6ltg button');
    await page.waitForResponse((response) => {
      return response.url().includes('sk');
    });
    await page.goto('https://facebook.com');
    await page.waitForSelector('[aria-label="게시물 작성"] span')
    await page.click('[aria-label="게시물 작성"] span');
    await page.waitForSelector('._1mf._1mj span')
    console.log('before click');
    //await page.click('._1mf._1mj span')
    await page.keyboard.type('페이스북은 김혁진 봇에게 점령당했습니다..');
    await page.click('[aria-label="게시"]');
    console.log('click')
    //await page.click('._1mf._1mj span');
    //
    //await page.type(,'가즈아')
    
/*     await page.close();
    await browser.close();
    await db.sequelize.close(); */
  } catch (e) {
    console.error(e);
  }
}

crawler();