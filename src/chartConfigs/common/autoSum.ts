import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler({ dataset, series }) {
    const source = dataset.source;
    if (dataset.source.length > 2) {
      const sum = new Array(source[0].length).fill(0);
      sum[0] = 'sum';
      for (let i = 1; i < sum.length; i++) {
        let total = 0;
        for (let j = 1; j < source.length; j++) {
          total += +source[j][i];
        }
        sum[i] = total;
      }
      source.push(sum);
      series.push(series[0]);
    }
  },
};

export default config;
