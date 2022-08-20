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
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36');
   
    const id = process.env.ID;
    const password = process.env.PASSWORD;
    await page.goto('https://instagram.com');

    await page.waitForSelector('button.y3zKF')
    await page.type('[name="username"]', process.env.ID);
    await page.type('[name="password"]', process.env.PASSWORD);
    await page.waitForTimeout(2000);
    //await page.click('#loginbutton');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.cmbtv button');
    await page.click('.cmbtv button');

    //await page.waitForNavigation(); // 페이스북 로그인 페이지로 넘어가는 것을 기다림 
  } catch (e) {
    console.error(e);
  }
}

crawler();