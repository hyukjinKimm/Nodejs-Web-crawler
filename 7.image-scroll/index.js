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
      const imgEls = document.querySelectorAll('.ripi6  img.YVj9w');
      if(imgEls.length) { 
        imgEls.forEach((v) => {
          if(v.src) {
            images.push(v.src);
          }
        });
        return images;
      }
    }
    );
    console.log(result);
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};
crawler();