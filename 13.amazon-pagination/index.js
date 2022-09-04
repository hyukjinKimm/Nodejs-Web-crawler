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

    let result = []

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
    }))

   console.log(result)

   
  } catch (e) {
    console.error(e);
  }
}

crawler();