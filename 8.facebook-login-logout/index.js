const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

const crawler = async () => {
  try{
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1920,1080"] });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1080,
        height: 1080
    });
    const id = process.env.ID;
    const password = process.env.PASSWORD;
    await page.goto('https://facebook.com');
    await page.evaluate(( id, password ) => {
        document.querySelector("#email").value = id;
        document.querySelector("#pass").value = password;
        document.querySelector('._6ltg button').click();
    }, id, password)

    //await page.close();
    //await browser.close();


  } catch (e) {

  }
};

crawler();