const xlsx = require('xlsx');

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