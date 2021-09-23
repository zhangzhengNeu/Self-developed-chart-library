import { SpecificChartConfig } from '../../types';
import { merge } from 'lodash-es';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {},
  },
  optionHandler(option) {
    option.yAxis.forEach((item: any, i: any) => {
      item.scale = true;
      delete item.max;
      delete item.min;
      delete item.interval;
      if (i === 1) {
        merge(item, { splitLine: { show: false } });
      }
    });
  },
};

export default config;
