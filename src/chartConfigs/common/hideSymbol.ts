import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {},
  optionHandler({ series }) {
    series.forEach(item => {
      merge(item, {
        showSymbol: false,
        label: { show: false },
      });
    });
  },
};

export default config;
