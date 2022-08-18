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
    await page.waitForSelector('[data-pagelet^="FeedUnit_"]');
    const newPost = await page.evaluate(() => {
      const firstFeed = document.querySelector('[data-pagelet^="FeedUnit_"]');
      const name = firstFeed.querySelector('h4 strong') && firstFeed.querySelector('h4 strong').innerText;
      const content = firstFeed.querySelector('[data-ad-comet-preview="message"]') && firstFeed.querySelector('[data-ad-comet-preview="message"]').innerText;
      const img = firstFeed.querySelectorAll('.om3e55n1[id^=jsc] img') && firstFeed.querySelectorAll('.om3e55n1[id^=jsc] img').src;
      if (firstFeed.querySelector('[aria-label="좋아요 삭제"]')){
        firstFeed.querySelector('[aria-label="좋아요 삭제"]').click();
      } else{
        firstFeed.querySelector('[aria-label="좋아요"]').click();
      }

      firstFeed.parentNode.removeChild(firstFeed);
      return {
        name, content, img
      };
    })
/*     const likeBtn = await page.$('[data-pagelet^="FeedUnit_"] [aria-label="좋아요"]')
    
    await page.evaluate((like) => {
      like.click();
    }, likeBtn)
 */
    console.log(newPost);

      
  } catch (e) {
    console.error(e);
  }
}

crawler();