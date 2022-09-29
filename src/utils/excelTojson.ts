const { workerData, parentPort } = require('worker_threads');
const xlsx = require('xlsx');
const { wb, sheetNames } = workerData;

const data = sheetNames.map((sheet) => {
  const totalRow = xlsx.utils.decode_range(wb.Sheets[sheet]['!ref']).e.r;
  // 依托sheet的名字取excel表中的数据
  return handleExcel(totalRow, wb.Sheets[sheet], sheet);
});

function handleExcel(totalRow, sheet, sheetName) {
  let rowArr = [];
  const temp = {};
  //  每列的字段映射
  const tableState = new Map();
  tableState
    .set(0, 'date_time')
    .set(1, 'anchor')
    .set(2, 'union')
    .set(3, 'live_water');
  // 遍历行数
  for (let r = 2; r < totalRow; r++) {
    const rowObj = {};
    // 遍历列数固定4
    for (let c = 0; c < 4; c++) {
      const eRow = sheet[xlsx.utils.encode_cell({ r, c })];
      // 填充对应数据
      rowObj[tableState.get(c)] = xlsx.utils.format_cell(eRow);
    }
    rowArr.push(rowObj);
    temp[sheetName] = rowArr;
    temp['gameName'] = sheetName;
  }
  return temp;
}

parentPort.postMessage(data);
parentPort.close();
