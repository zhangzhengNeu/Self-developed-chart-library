const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const pkg = require('../package.json');
const holiday = require('@xmly/rocket-holiday')
// const holiday = require('../../rocket-holiday/sdk/lib/index.js')
const dayjs = require('dayjs')

function clear(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      const curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        clear(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

clear(path.join(__dirname, 'lib'));

childProcess.spawn('mkdir', ['lib']);

console.log(`version: ${pkg.version}`);
console.log('tsc~~');
childProcess.exec('tsc', () => {
  console.log('tsc done');
});

console.log('build~~');
childProcess.exec('rollup -c', (error, stdout, stderr) => {
  console.log('build done');
  console.log(stderr);
});

const lastDay = dayjs().endOf('year').format("YYYY-MM-DD");
const currentDay = dayjs().format('YYYY-MM-DD')
const isLastDay = lastDay === currentDay;
// 最后一天调用一次请求明年的节假日
isLastDay && 
getRecentYearsHoliday();

function getRecentYearsHoliday() {
  const currentYear = parseInt(dayjs().format("YYYY"))
  const years = [currentYear - 1, currentYear, currentYear + 1];
  years.forEach(async year => await saveHoliday(year))  
}

/**
 * 创建目录
 */
function createFile(pFile) {
  fs.createWriteStream(`${pFile}`, function (err) {
    if(err)
      throw err;
    console.log('创建目录成功')
  });
}

function saveHoliday(date) {
  holiday._fetchHoliday({ date }).then((data) => {
    const filePrefix = '../src/utils/rocket-holiday'
    const downloadFile = path.join(__dirname, filePrefix);
    fs.exists(`${downloadFile}/${date}.json`, async exist => {
      !exist && (await createFile(`${downloadFile}/${date}.json`))
      await fs.writeFile(path.join(`${downloadFile}/${date}.json`), JSON.stringify(data), async (err) => {
        console.log('err', err)
        if(err) throw err;
      })
    })
  })
}
