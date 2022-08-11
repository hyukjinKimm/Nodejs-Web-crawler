const puppeteer = require('puppeteer'); 
const axios = require('axios');
const fs = require('fs');

fs.readdir('images', (err) => {
    if (err) {
      console.error('images 폴더가 없어 images 폴더를 생성합니다.');
      fs.mkdirSync('images');
    }
  });
const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://unsplash.com');
    let result = [];
    while(result.length <= 30) {
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
          console.log(result)
          await page.waitForSelector('.VQW0y');
          console.log('새 이미지 태그 로딩 완료!');
    }
    result.forEach(async (src) => {
      const imageResult = await axios.get(src.replace(/\?.*$/, ''), {
        responseType: 'arraybuffer',
      });
      fs.writeFileSync(`images/${new Date().valueOf()}.jpg`, imageResult.data); // 현재시간을 파일 이름으로 

    });
    await page.close();
    await browser.close();    

  } catch (e) {
    console.error(e);
  }
};
crawler();