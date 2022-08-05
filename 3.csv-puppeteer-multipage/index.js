const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const puppeteer = require('puppeteer'); 

const csv = fs.readFileSync('csv/data.csv');
const records = parse(csv.toString('utf-8'));

const crawler = async () => {
  try{
    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === 'production' });
    await Promise.all(records.map(async (r, i) => {
      try{
        const page = await browser.newPage();
        await page.goto(r[1]);
        const scoreE1 = await page.$('.score_left .star_score');
        if (scoreE1) {
          const text = await page.evaluate(tag => tag.textContent, scoreE1)
          console.log(r[0], " 평점:",text.trim());
        }
        await page.close();
      } catch(e){
          console.error(e);
      }

    }))
  await browser.close();
  } catch(e) {
    console.error(e);
  }

};

crawler();