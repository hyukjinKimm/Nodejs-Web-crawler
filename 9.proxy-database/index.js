const puppeteer = require('puppeteer');

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=1920,1080', '--disable-notifications'],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080,
    });

   await page.goto('https://spys.one/en/');
   const proxies = await page.evaluate(() => {
    const a = document.querySelectorAll('tr > td:first-child > .spy14 ')[0].innerText;  

    const b = document.querySelectorAll('tr > td:nth-child(2) .spy1')[0].innerText 
    
    const c = Array.from( document.querySelectorAll('tr > td:nth-child(5) .spy1 acronym')).map((item) => {
      if(item.innerText.search("[0-9]+%") == -1)
        return "0"
      else
         return item.innerText.match("[0-9]+%")["0"].replace("%","");
    });
    
   })

   await page.close();
   await browser.close();

  } catch (e) {
    console.error(e);
  }
};

crawler();