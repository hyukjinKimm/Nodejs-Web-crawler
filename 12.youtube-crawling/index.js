const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

const db = require('./models');
dotenv.config();

const crawler  = async () => {
  try{
    await db.sequelize.sync();
    const browserFetcher = puppeteer.createBrowserFetcher(); // await 없음
    const revisionInfo = browserFetcher.download('1042288'); // download 의 인자로 node_checkavailability 의 결과로 선택한 크로미윰의 버전을 적어준다

    const browser = await puppeteer.launch({ 
        headless: false, 
        executablePath:  revisionInfo.executablePath, // 여기에 추가로 적어줌.
        args: ["--window-size=1920,700", "--disable-notifications"],
        userDataDir: './data'
     });
     
     const page = await browser.newPage();
     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36');
     await page.setViewport({
         width: 700,
         height: 900
     });

     await page.goto('https://youtube.com', {
        waitUntil: 'networkidle0' // 모든 네트워크 요청이 마무리 되야 다음 코드로 진행.
     });
     if(!await page.$('avatar-btn')){
        await page.waitForSelector('#buttons ytd-button-renderer:last-child a');
        await page.click('#buttons ytd-button-renderer:last-child a');
        await page.waitForNavigation({
           waitUntil: 'networkidle2' // 2개정도의 네트워크 요청은 덜 마무리 되어도 다음 코드로 진행
        });
        await page.waitForSelector('#identifierId');
        await page.type('#identifierId', process.env.GOOGLE_ID);
        await page.waitForSelector('#identifierNext');
        await page.click('#identifierNext')
        /**
         * 
         *  로그인 코드 작성
         */
     } else {
        console.log('이미 로그인 됨')
     }

     // await page.close();
     // await browser.close();
  } catch(e) {

  }
}

crawler()
