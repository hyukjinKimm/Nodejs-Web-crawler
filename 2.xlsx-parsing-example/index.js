const xlsx = require('xlsx');
const axios = require('axios'); // ajax 라이브 러리 
const cheerio = require('cheerio'); // html 파싱

const workbook = xlsx.readFile('xlsx/data.xlsx');
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);
/* 
records.forEach((r, i) => {
  console.log(r.제목, r.링크);
})

for (const [i, r] of records.entries()) {
  console.log(r.제목, r.링크);
}
*/

const crawler = async () => {
  await Promise.all(records.map(async (r) => {
    const response = await axios.get(r.링크);
    if (response.status === 200 ){ // 응답이 성공한 경우 
      const html = response.data;
      
      const $ = cheerio.load(html);
      const text = $('.score_left .star_score').text();
      console.log(r.제목, '평점: ', text.trim());
    }
  }));

}

crawler();