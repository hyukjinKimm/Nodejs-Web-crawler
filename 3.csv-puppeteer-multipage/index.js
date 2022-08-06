const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');
const puppeteer = require('puppeteer'); 

const csv = fs.readFileSync('csv/data.csv');
const records = parse(csv.toString('utf-8'));

const crawler = async () => {

  try{
    const result = [];

    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === 'production' });
    await Promise.all(records.map(async (r, i) => {
      try{
        const page = await browser.newPage();
        await page.goto(r[1]);
        // const 태그핸들러 = await page.$(선택자);
        
        const text = await page.evaluate(() => { //document 를 쓸 수 있다.
          const score = document.querySelector('.score_left .star_score');
          if(score){
            return score.textContent;;
          }
        });
        if ( text ) {
          console.log(r[0], '평점', text.trim() );
          result[i] = [r[0], r[1], text.trim()];
        }



        await page.close();
      } catch(e){
          console.error(e);
      }

    }));
  await browser.close();
  const str = stringify(result);
  fs.writeFileSync('csv/result.csv',str);
  } catch(e) {
    console.error(e);
  }

};

crawler();