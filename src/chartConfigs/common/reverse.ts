import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {
      yAxis: {
        axisLabel: {
          showMaxLabel: true,
          showMinLabel: true,
        },
      },
    },
  },
  optionHandler: (options, datasetParams = {}) => {
    const { reverseData = true } = datasetParams;
    const { dataset } = options;
    if (reverseData) {
      dataset.source = dataset.source.map((item: any[]) => {
        const [name, ...value] = item;
        return [name, ...value.reverse()];
      });
    }
    merge(options, {
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
      },
    });
  },
};

export default config;
