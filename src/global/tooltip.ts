import { values } from 'lodash-es';
import { getFormatter } from '../utils/valueFormat';

// name value为占位符，默认显示name和value
const getValue = (params: any, formatter: Function, valueKeys: any) => {
  const data = Array.isArray(params) ? params : [params];
  data.sort((a, b) => b.value[b.seriesIndex + 1] - a.value[a.seriesIndex + 1]);
  const listData = data.map((item, index) => {
    const { componentType, dimensionNames, data = {}, seriesIndex } = item;
    let value = Array.isArray(item.value) ? item.value[seriesIndex + 1] : item.value;
    value = formatter ? formatter(value) : value;
    if (data && valueKeys?.length) {
      value = valueKeys.map((item: any) => {
        let val = data[item] || '';
        return item === 'value' ? value || val : val;
      });
    } else {
      value = [value];
      item.percent && value.push(`(${item.percent}%)`);
    }

    const name = data?.name || dimensionNames[seriesIndex + 1] || item.name;
    let { color } = item;
    if (componentType === 'markPoint') {
      color = 'orangered';
    }
    //兼容关系图
    const id = item.data.id;
    const dataType = item.dataType;
    return { color, name, value, id, dataType };
  });
  return { title: data[0]?.name === listData[0].name ? '' : data[0]?.name, listData };
};

const getStyle = (mode: string, { name, value, color, id, dataType }: any = {}) => {
  let key = '';
  let newValue = value
    .map((i: any) => `<div style="display: table-cell; padding-left: 10px">${i}</div>`)
    .join('');

  switch (mode) {
    case 'light':
      key = id
        ? `<div style="color:${color}">${id}:</div>` //兼容关系图
        : dataType == 'edge'
        ? `<div style="color:${color}">${name}</div>`
        : `<div style="color:${color}">${name}:</div>`;
      newValue =
        dataType == 'edge'
          ? ''
          : `<div style="text-align: right; display: table-row;">${newValue}</div>`;
      break;
    default:
      const dot = `<i style="display:inline-block; width: 7px; height: 7px; background:${color}; border-radius: 7px; vertical-align: 1px; margin-right: 6px"></i>`;
      key = id
        ? `<div>${dot} ${id}:</div>` //兼容关系图
        : dataType == 'edge'
        ? `<div>${dot} ${name}</div>`
        : `<div>${dot} ${name}:</div>`;
      newValue =
        dataType == 'edge'
          ? ''
          : `<div style="text-align: right; display: table-row;">${newValue}</div>`;
  }

  return { key, value: newValue };
};

/**
 * 格式化tooltip
 * @param formatter 每项的格式化函数
 */
const formatterFun = (option?: any) => {
  const { mode, formatter = getFormatter('number'), valueKeys = [], tips } = option || {};
  const tipsDom = tips ? `<p style="color: #aaa; margin: 0">${tips}</p>` : '';

  return (params: any) => {
    const data = getValue(params, formatter, valueKeys);
    let keys = '';
    let values = '';
    data.listData.forEach((item) => {
      const style = getStyle(mode, item);
      keys += style.key;
      values += style.value;
    });
    return `
          <div>
            <div style="font-size:12px;">${data.title} </div>
            <div style="display:flex; margin: 5px 0;">
              <div>${keys}</div>
              <div style="display:table; margin-left: 5px">${values}</div>
            </div>
            ${tipsDom}
          </div>
      `;
  };
};

const tooltipFormatter = (chartOptions: any, datasetParams: any) => {
  if (!datasetParams?.$tooltip) return;
  return {
    tooltip: {
      formatter: formatterFun(datasetParams.$tooltip),
    },
  };
};

export { getStyle };

export default {
  tooltipFormatter,
  formatter: formatterFun,
};
