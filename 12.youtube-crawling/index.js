const puppeteer = require('puppeteer-extra')
const dotenv = require('dotenv');
const fs = require('fs');
const ytdl = require('ytdl-core');
dotenv.config()

// 플러그인을 puppeteer의 기본값으로 넣어주세요.
const StealthPlugin = require('puppeteer-extra-plugin-stealth')


puppeteer.use(StealthPlugin())

// 일반적인 사용 예시
puppeteer.launch({
     headless: false,
     userDataDir: './data' }
    )
    .then(async browser => {
    console.log('Running tests..')
    const page = await browser.newPage()
    await page.goto('https://youtube.com')
    if(!await page.$('#avatar-btn'))
    {
        await page.waitForSelector('#buttons ytd-button-renderer:last-child a');
        await page.click('#buttons ytd-button-renderer:last-child a');
        await page.waitForNavigation({
        waitUntil: 'networkidle2' // 2개정도의 네트워크 요청은 덜 마무리 되어도 다음 코드로 진행
        });
        await page.waitForSelector('#identifierId');
        await page.type('#identifierId', process.env.GOOGLE_ID);
        await page.waitForSelector('#identifierNext');
        await page.click('#identifierNext')   
        await page.waitForSelector('input[name="Passwd"]');
        await page.evaluate((password)=> {
        document.querySelector('input[name="Passwd"]').value = password;
    
        }, process.env.GOOGLE_PASSWORD);
        await page.waitForTimeout(3000);
        await page.waitForSelector('#passwordNext');
        await page.click('#passwordNext');
    } else{
        console.log('이미 로그인 된 상태입니다.')
    }

    
    await page.goto('https://youtube.com/feed/trending', {
        waitUntil: 'networkidle0'
    });

    await page.waitForSelector('ytd-video-renderer');
    await page.click('ytd-video-renderer');

    const url = await page.url();
    const title = await page.title();
    console.log(url)
    
    const info = await ytdl.getInfo(url);
    console.log(info)
    ytdl(url).pipe(fs.createWriteStream(`test.mp4`));
    
  //await page.screenshot({ path: 'testresult.png', fullPage: true })
  //await browser.close()
  console.log(`All done, check the screenshot. ✨`)
})