const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

const crawler = async () => {
  try{
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
    await page.hover('._6ltg button');
    await page.click('._6ltg button');
    await page.waitForResponse((response) => {
      return response.url().includes('sk');
    });
    


     await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(3000);
    await page.click('.j83agx80.l9j0dhe7 image');
    await page.waitForSelector('.b20td4e0.muag1w35 > div:last-child span');
    await page.waitForTimeout(3000);
    await page.click('.b20td4e0.muag1w35 > div:last-child span');

/*     await page.evaluate(() => { dom API 도 사용 가능
      document.querySelector('.b20td4e0.muag1w35 > div:last-child span').click();
    }) */
    
/*     await page.evaluate(( id, password ) => {
    document.querySelector("#email").value = id;
    document.querySelector("#pass").value = password;
    document.querySelector('._6ltg button').click();
}, id, password) */

    //await page.close();
    //await browser.close();


  } catch (e) {

  }
};

crawler();