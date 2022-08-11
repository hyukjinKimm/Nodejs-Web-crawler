const puppeteer = require('puppeteer'); 
const axios = require('axios');
const fs = require('fs');

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://unsplash.com');
    const result = await page.evaluate(() => {
      const images = []; 

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
    console.log(result);
    await page.waitForSelector('.VQW0y');
    console.log('태그 로딩 완료!');
  } catch (e) {
    console.error(e);
  }
};
crawler();