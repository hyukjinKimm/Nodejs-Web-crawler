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
    await page.waitForTimeout(2000);
    await page.click('._6ltg button');
    await page.waitForResponse((response) => {
      return response.url().includes('sk');
    });
    await page.keyboard.press('Escape');
  } catch (e) {
    console.error(e);
  }
}

crawler();