import { EChartOption } from 'echarts';
import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';
import { chartInReverse } from '../../utils';
const config: SpecificChartConfig = {
  defaultChartProps: {},
  optionHandler(options, datasetParams = {}) {
    let { datazoomX, datazoomY } = datasetParams;
    const grid: EChartOption['grid'] = {};
    const legend: any = {};

    const dataZoom = [
      { orient: 'horizontal', xAxisIndex: [0], bottom: 5, show: true },
      { orient: 'vertical', yAxisIndex: [0], top: 18, show: true },
    ];
    if (datazoomX) {
      grid.bottom = 60;
      legend.bottom = 35;
    }
    if (datazoomY) {
      grid.right = 50;
    }
    if (chartInReverse(options.xAxis, options.yAxis)) {
      datazoomX = datazoomX === undefined ? false : datazoomX;
    } else {
      datazoomY = datazoomY === undefined ? false : datazoomY;
    }
    dataZoom[0].show = datazoomX;
    dataZoom[1].show = datazoomY;

    merge(options, {
      grid,
      legend,
      dataZoom,
    });
  },
};

export default config;
