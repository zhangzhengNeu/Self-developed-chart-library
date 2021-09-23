import numeral from 'numeral';

const emptyValue = '--';
const abbrList = [
  { unit: '亿', number: 10000 * 10000 },
  { unit: '万', number: 10000 },
];

numeral.nullFormat(emptyValue);

// 小数格式化
const decimalPlace = (place: number = 0): string => {
  return '.'.padEnd((place > 10 ? 10 : place) + 1, '0');
};

const isEmpty = (value: any) => {
  return !value && value !== 0;
};

// 字符串展示
const renderString = (value: string | number): string => (!isEmpty(value) ? value.toString() : '');

// 备份
const renderString1 = (value: string | number): string => {
  return value.toString().replace(/\d+/, function (n) {
    return n.replace(/\B(?=(?:\d{3})+$)/g, ',');
  });
};

// 数据整数使用千分位展示
// place = 10，默认最多10位小数
const renderNumber = (value: string | number, { place = 10 } = {}): string => {
  if (isEmpty(value)) return emptyValue;
  const val = numeral(value).format(`0,0${'.['.padEnd((place > 10 ? 10 : place) + 2, '0')}]`);
  return val === emptyValue ? value : val;
};

// 整数
const renderInteger = (value: number) => numeral(value).format('0,0');

// 保留两位小数
const renderDecimal = (value: string | number, { place = 2 } = {}): string => {
  return numeral(value).format(`0,0${decimalPlace(place)}`);
};

// 百分比展示
const renderPercent = (value: string | number, { place = 2 } = {}): string =>
  numeral(value).format(`0${decimalPlace(place)}%`);

// 中文缩写
const renderNumberAbbr = (value: string | number, params: any): string => {
  if (isEmpty(value)) return emptyValue;

  let { maxValue = 0 } = params || {};

  let unit = '';
  let newValue = value;

  maxValue = maxValue || value;

  abbrList.some((abbr) => {
    if (maxValue < abbr.number) return false;
    unit = abbr.unit;
    newValue = Number(value) / abbr.number;
    return true;
  });

  return renderNumber(newValue) + unit;
};

const getFormatter = (format: string = '') => {
  const res = format.match(/\.(\d)([\S]+)/);
  if (res && res[1] && res[2]) {
    const place = res[1];
    const type = res[2];
    const fun = renderNumeralMap[type] || renderNumeralMap['string'];
    return (value: number | string) => fun(value, { place: +place });
  }
  return renderNumeralMap[format] || renderNumeralMap['string'];
};

export type NumeraTypeName = 'string' | 'number' | 'integer' | 'decimal' | 'percent' | 'abbr';

interface NumeraType {
  string: Function;
  number: Function;
  integer: Function;
  decimal: Function;
  percent: Function;
  abbr: Function;
  [propName: string]: any;
}

const renderNumeralMap: NumeraType = {
  number: renderNumber,
  decimal: renderDecimal,
  integer: renderInteger,
  percent: renderPercent,
  string: renderString,
  abbr: renderNumberAbbr,
};

export { getFormatter, renderNumeralMap };
