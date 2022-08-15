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

    page.on('dialog', async (dialog) => {
      console.log(dialog.type(), dialog.message());

/*       if (dialog.message() == "???"){ // 원하는 동작을 분기처리 가능.
        await dialog.accept();
      } else if ( dialog.message() == "????"){
        await dialog.dismiss();
      } */ 

      await dialog.accept(); // accept는 confirm의 확인, dismiss는 취소
    });
    // 이벤트 리스너는 위에..

    await page.evaluate(() => {
      if (confirm('이 창을 꺼야 다음으로 넘어갑니다.')) {
        return location.href = 'http://zerocho.com';
      }
      return location.href = 'http://inflearn.com';
    });


/*      page.on('dialog', async (dialog) => {
       console.log(dialog.type(), dialog.message());
       await dialog.accept('http://inflearn.com');
     });
    
     await page.evaluate(() => {
       const data = prompt('주소를 입력하세요');
       location.href = data;
     }); */

  } catch (e) {
    console.error(e);
  }
};

crawler();