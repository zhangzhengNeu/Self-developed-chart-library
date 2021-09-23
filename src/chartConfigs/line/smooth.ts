import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {},
  optionHandler({ series }) {
    series.forEach(item => {
      item.smooth = true;
    });
  },
};

export default config;
