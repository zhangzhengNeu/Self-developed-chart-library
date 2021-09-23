import { ChartOptions } from './types';

const opts: ChartOptions = {
  tooltip: {},
  legend: { type: 'scroll' },
  xAxis: {
    type: 'category', // X轴默认为离散类目轴
  },
  yAxis: {
    type: 'value', // Y轴默认为数值轴
  },
};

export default opts;
