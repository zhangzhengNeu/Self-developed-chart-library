import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler({ series }, datasetParams = {}) {
    const { type = 'average', name = '平均值' } = datasetParams;
    series.forEach(item => {
      merge(item, {
        markLine: {
          data: [{ type, name }],
        },
      });
    });
  },
};

export default config;
