const puppeteer = require('puppeteer');
const db = require('./models');
/* sequelize.sync({ force: true })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  }); */



const crawler = async () => {
  
  try {
    await db.sequelize.sync();
    let browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=1920,1080', '--disable-notifications'],
    });
    let page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });

   await page.goto('https://spys.one/en/');
   const proxies = await page.evaluate(() => {
    const ips = Array.from(document.querySelectorAll('tr > td:first-child > .spy14 ')).map((v) => v.innerText);  

    const types = Array.from(document.querySelectorAll('tr > td:nth-child(2) .spy1')).map((v) => v.innerText);
    
    const uptimes = Array.from( document.querySelectorAll('tr > td:nth-child(5) .spy1 acronym')).map((item) => {
      if(item.innerText.search("[0-9]+%") == -1)
        return "0"
      else
         return item.innerText.match("[0-9]+%")["0"].replace("%","");
    });
    
    return ips.map((v, i) => {
      return {
      ip : v,
      type : types[i],
      uptime : uptimes[i] 
      }
    });
   });
   const filtered =  proxies.filter((v) => v.type.startsWith('HTTP')).sort((p, c) => c.uptime - p.uptime);
   await Promise.all(filtered.map((v) => {
    db.Proxy.upsert({
        ip: v.ip,
        type: v.type,
        uptime: v.uptime
    })
   }))
   await page.close();
   await browser.close();
   const fastestProxy = await db.Proxy.findAll({
    order: [['uptime', 'DESC']]
   });
   
   browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1920,1080', '--disable-notifications', `--proxy-server=${fastestProxy[0].ip}`],
   });
   const browser2 = await puppeteer.launch({
      headless: false,
      args: ['--window-size=1920,1080', '--disable-notifications', `--proxy-server=${fastestProxy[1].ip}`],
    });
    const browser3 = await puppeteer.launch({
      headless: false,
      args: ['--window-size=1920,1080', '--disable-notifications', `--proxy-server=${fastestProxy[2].ip}`],
    });

   page = await browser.newPage();
   const page2 = await browser2.newPage();  
   const page3 = await browser3.newPage();

/*    await page.goto('http://test.com');
   await page2.goto('http://test.com');
   await page3.goto('http://test.com'); */
   
   await page.close()
   await page2.close()
   await page3.close()
   
   await browser.close();
   await browser2.close();
   await browser3.close();
   
   await db.sequelize.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();