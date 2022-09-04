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
     const keyword = 'crawler'
     await page.goto(`https://github.com/search?q=${keyword}`,{
         waitUntil: 'networkidle0'
     });
     let result = []
     let pageNum = 1
     while(pageNum <= 5){
        const r = await page.evaluate(() => {
            
            const tags = document.querySelectorAll('.repo-list-item')
            const result = []
            tags.forEach((t) => {
              result.push({
                  name: t && t.querySelector('a') && t.querySelector('a').innerText,
                  stars: t && t.querySelector(' .mr-3') && t.querySelector('.mr-3').innerText,
                  lang: t && t.querySelector('.mr-3:nth-child(2)') && t.querySelector('.mr-3:nth-child(2)').innerText
              })
            })
            return result
        })
        result.push(r)
        await page.waitForSelector('.next_page')
        await page.click('.next_page')
        pageNum++;
        await page.waitForResponse((res) => {
            console.log(res.url(), res.status())
            return res.url().startsWith(`https://github.com/search?p=${pageNum}`) && res.status() === 200
        });
        await page.waitForTimeout(1000)
     }
     console.log(result)

/*     let result = []

    await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(async (v) => {
        const page = await browser.newPage();
        await page.setViewport({
            width: 900,
            height: 900
        });
        const keyword = 'mouse'
        await page.goto(`https://amazon.com/s?k=${keyword}&page=${v}`,{
            waitUntil: 'networkidle0'
        });
        const r = await page.evaluate(() => {
          const tags = document.querySelectorAll('.s-result-list > div')
          const result = []
          tags.forEach((t) => {
            result.push({
                name: t && t.querySelector('.s-result-list > div h2 span') && t.querySelector('.s-result-list > div h2 span').innerText,
                price: t && t.querySelector('.s-result-list > div .a-offscreen') && t.querySelector('.s-result-list > div .a-offscreen').innerText
            })
          })
          return result
        })
        
        result.push(r)
    })) */

  
   
  } catch (e) {
    console.error(e);
  }
}

crawler();