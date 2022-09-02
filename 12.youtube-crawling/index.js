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
        args: ["--window-size=1920,1080", "--disable-notifications"],
        userDataDir: './data'
     });
     const page = await browser.newPage();
     await page.setViewport({
         width: 700,
         height: 900
     });

     await page.goto('https://youtube.com');

     // await page.close();
     // await browser.close();
  } catch(e) {

  }
}

crawler()
