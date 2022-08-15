const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

const crawler = async () => {
  try{
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1920,1080", "--disable-notifications"] });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1080,
        height: 1080
    });
    const id = process.env.ID;
    const password = process.env.PASSWORD;
    await page.goto('https://facebook.com');
    await page.evaluate(() => {
      (() => {
        const box = document.createElement('div');
        box.classList.add('mouse-helper');
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
          .mouse-helper {
            pointer-events: none;
            position: absolute;
            z-index: 100000;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            background: rgba(0,0,0,.4);
            border: 1px solid white;
            border-radius: 10px;
            margin-left: -10px;
            margin-top: -10px;
            transition: background .2s, border-radius .2s, border-color .2s;
          }
          .mouse-helper.button-1 {
            transition: none;
            background: rgba(0,0,0,0.9);
          }
          .mouse-helper.button-2 {
            transition: none;
            border-color: rgba(0,0,255,0.9);
          }
          .mouse-helper.button-3 {
            transition: none;
            border-radius: 4px;
          }
          .mouse-helper.button-4 {
            transition: none;
            border-color: rgba(255,0,0,0.9);
          }
          .mouse-helper.button-5 {
            transition: none;
            border-color: rgba(0,255,0,0.9);
          }
          `;
        document.head.appendChild(styleElement);
        document.body.appendChild(box);
        document.addEventListener('mousemove', event => {
          box.style.left = event.pageX + 'px';
          box.style.top = event.pageY + 'px';
          updateButtons(event.buttons);
        }, true);
        document.addEventListener('mousedown', event => {
          updateButtons(event.buttons);
          box.classList.add('button-' + event.which);
        }, true);
        document.addEventListener('mouseup', event => {
          updateButtons(event.buttons);
          box.classList.remove('button-' + event.which);
        }, true);
        function updateButtons(buttons) {
          for (let i = 0; i < 5; i++)
            box.classList.toggle('button-' + i, !!(buttons & (1 << i)));
        }
      })();
    });

    await page.type('#email', process.env.ID);
    await page.type('#pass', process.env.PASSWORD);
    await page.hover('._6ltg button');
    await page.waitForTimeout(1000);
    await page.mouse.move(800, 300);
    await page.waitForTimeout(1000);
    await page.mouse.click(800, 300);
   
    
    //await page.click('._6ltg button');
    await page.waitForResponse((response) => {
      return response.url().includes('sk');
    });
    
     await page.waitForTimeout(5000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(3000);
    await page.click('.j83agx80.l9j0dhe7 image');
    await page.waitForSelector('.b20td4e0.muag1w35 > div:last-child span');
    await page.waitForTimeout(3000);
    await page.click('.b20td4e0.muag1w35 > div:last-child span');
    await page.waitForTimeout(1000);

/*     await page.evaluate(() => { dom API 도 사용 가능
      document.querySelector('.b20td4e0.muag1w35 > div:last-child span').click();
    }) */
    
/*     await page.evaluate(( id, password ) => {
    document.querySelector("#email").value = id;
    document.querySelector("#pass").value = password;
    document.querySelector('._6ltg button').click();
}, id, password) */

    await page.close();
    await browser.close();


  } catch (e) {

  }
};

crawler();