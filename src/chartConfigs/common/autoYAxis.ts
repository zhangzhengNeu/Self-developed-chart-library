import { SpecificChartConfig } from '../../types';
import { merge } from 'lodash-es';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {},
  },
  optionHandler(option) {
    const { yAxis } = option;

    if (Array.isArray(yAxis)) {
      yAxis.forEach((item) => {
        item.scale = true;
      });
    } else {
      merge(option, {
        yAxis: {
          scale: true,
        },
      });
    }
  },
};

export default config;
