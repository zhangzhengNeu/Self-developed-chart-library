import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {},
  optionHandler({ dataset, series }) {
    series.forEach((item) => {
      merge(item, {
        type: 'bar',
        barGap: '-100%',
        stack: dataset.source[1][0],
      });
    });
  },
};

export default config;
