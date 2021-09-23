import chartInReverse from './chartInReverse';
type Dataset = {
  source?: any[][];
};

// 数组极值
const listExtemum = (list: any[] = []) => {
  if (!list.length) {
    return [];
  }
  return [Math.min(...list), Math.max(...list)];
};

// 单个series极值
const sourceItemExtemum = (list: any[] = []) => {
  const values = list.slice(1);
  return listExtemum(values);
};

// series极值
export const seriesExtremum = (dataset: Dataset) => {
  const { source = [] } = dataset;
  const res = source.slice(1).map((item) => sourceItemExtemum(item));
  return res;
};

// dataSet极值
export const dataSetExtremum = (dataset: Dataset) => {
  const res = seriesExtremum(dataset);
  return listExtemum(res.flat());
};

// 轴最大值
export const axisMax = (chartOptions: any) => {
  const { xAxis, yAxis, dataset = { source: [] } } = chartOptions || {};
  const valueAxisName = chartInReverse(xAxis, yAxis) ? 'xAxis' : 'yAxis';
  const axisOption = chartOptions[valueAxisName] || {};
  if (+axisOption.max) {
    return +axisOption.max;
  }
  const [min, max] = dataSetExtremum(dataset);
  return max;
};

export default { series: seriesExtremum, dataset: dataSetExtremum, axisMax };
