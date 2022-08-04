const xlsx = require('xlsx');
const axios = require('axios'); // ajax 라이브 러리 
const cheerio = require('cheerio'); // html 파싱

const workbook = xlsx.readFile('xlsx/data.xlsx');
const ws = workbook.Sheets.영화목록;



/* const records = xlsx.utils.sheet_to_json(ws, {header: 'A'}); // 옵션추가 
records.shift(); // 첫번째 원소를 지워버림.
console.log(records) */
//console.log(ws['!ref']) // A1:B11

ws['!ref'] = "A2:B11";
const records = xlsx.utils.sheet_to_json(ws, {header: 'A'}); // 옵션추가 
console.log(records)


/* ws['!ref'] = ws['!ref'].split(':').map((v, i) => {
  if (i == 0) {
    return 'A2';
  }
}).join(':'); */
