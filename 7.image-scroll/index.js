const puppeteer = require('puppeteer'); 
const axios = require('axios');
const fs = require('fs');

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://unsplash.com');
    let result = [];
    while(result.length <= 60) {
        const srcs = await page.evaluate(() => {
            window.scrollTo(0, 0);
            let images = []; 
            //const imgEls = document.querySelectorAll('.ripi6  img.YVj9w');
            const imgEls = document.querySelectorAll('.VQW0y');
            if(imgEls.length) { 
              imgEls.forEach((v) => {
                let src = v.querySelector('img.YVj9w').src;
                if(src) {
                  images.push(src);
                }
                v.parentElement.removeChild(v);
              });
              window.scrollBy(0, 300);
              return images;
            }
          }
          );
          result = result.concat(srcs);
          console.log(result.length)
          await page.waitForSelector('.VQW0y');
          console.log('새 이미지 태그 로딩 완료!');
    }
    await page.close();
    await browser.close();    

  } catch (e) {
    console.error(e);
  }
};
crawler();