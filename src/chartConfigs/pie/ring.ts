import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {},
  },
  optionHandler({ series }, datasetParams = {}) {
    const { radius = ['40%', '60%'] } = datasetParams;
    series.forEach((item) => {
      merge(item, {
        radius: radius,
        label: merge({}, item.label, {
          formatter: (params: any) => {
            const { name, percent } = params;
            return `${name.replace(/(.{11})(.*)/, '$2' ? '$1...' : '$1')}\n${percent}%`;
          },
        }),
      });
    });
  },
};

export default config;
