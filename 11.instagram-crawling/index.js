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
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36');
    const id = process.env.ID;
    const password = process.env.PASSWORD;
    await page.goto('https://instagram.com');

    if (await page.$('[href="/rraamm_m/"]')) {
      console.log('이미 로그인 되어 있습니다.');
    } else {
        await page.waitForSelector('button.y3zKF')
        await page.type('[name="username"]', process.env.ID);
        await page.type('[name="password"]', process.env.PASSWORD);
        await page.waitForTimeout(2000);
        //await page.click('#loginbutton');
        await page.keyboard.press('Enter');
        await page.waitForSelector('.cmbtv button');
        await page.click('.cmbtv button');
        
        //await page.waitForNavigation(); // 페이스북 로그인 페이지로 넘어가는 것을 기다림 
        console.log('로그인을 완료 했습니다.')
    }
    await page.waitForSelector('article');
    const result = [];
    let prevPostId = '';
    while ( result.length < 5 ) {
      const moreBtn = await page.$('span._aacl._aaco._aacu._aacx._aad7._aade:nth-child(3) div'); // 더보기 버튼 클릭
      if(moreBtn){
        await page.evaluate((btn) => btn.click(), moreBtn);
      }
  

      const newPost = await page.evaluate(() => {
        const article = document.querySelector('article');
        const postId = article.querySelector('article [href^="/p"]') && article.querySelector('article [href^="/p"]').href.split('/').slice(-3, -2)[0];
        const name = article.querySelector('article a') && article.querySelector('article a').href.split('/')[3];
        const img = article.querySelector('article ._aagt') && article.querySelector('article ._aagt').src;
        const content = article.querySelector('span._aacl._aaco._aacu._aacx._aad7._aade:nth-child(3) span') && article.querySelector('span._aacl._aaco._aacu._aacx._aad7._aade:nth-child(3) span').innerText;
        
        return {
          postId, name, img, content
        }
      });

      if(prevPostId !== newPost.postId){
        console.log(newPost);
        if(!result.find((v) => v.postId === newPost.postId)){
          const exist = await db.Instagram.findOne({where: {postId: newPost.postId}});
          if(!exist) {
            console.log('push')
            result.push(newPost);
          }
        }
      }
      await page.waitForTimeout(1000);
  
      await page.evaluate(() => {
        const article = document.querySelector('article');
        const heartBtn = article.querySelector('._aamw button');
        if(heartBtn.querySelector('svg[aria-label="좋아요"]')){
          heartBtn.click();
        }
      })
      prevPostId = newPost.postId
      console.log(result.length)
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollBy(0, 1100));
      
    }
    console.log(result);
    console.log(result.length);
    await Promise.all(result.map((v) => {
      return db.Instagram.create({
        postId: v.postId,
        media: v.img,
        content: v.content,
        writer: v.name
      });
    }))

    await db.sequelize.close();
  } catch (e) {
    console.error(e);
  }
}

crawler();