const puppeteer = require('puppeteer');
const dotenv = require('dotenv');


dotenv.config();

const crawler = async () => {
  try{

    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ["--window-size=900,1080", "--disable-notifications"],
        userDataDir: './data'
     });
     const page = await browser.newPage();
     await page.setViewport({
         width: 900,
         height: 900
     });
    
     await page.goto(`https://twitter.com`,{
         waitUntil: 'networkidle0'
     });
 
     await page.click('a[href="/login"]')
     await page.waitForSelector('input[type="text"]')
     await page.type('input', process.env.ID)
     await page.keyboard.press('Enter');

     await page.waitForSelector('input[name="password"]')
     await page.type('input[name="password"]', process.env.PASSWORD)
     await page.keyboard.press('Enter');
  } catch (e) {
    console.error(e);
  }
}

crawler();