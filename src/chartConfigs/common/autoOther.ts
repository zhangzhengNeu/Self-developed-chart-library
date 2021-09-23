import { SpecificChartConfig } from '../../types';
import { cloneDeep } from 'lodash-es';

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler(options, datasetParams = {}) {
    const { dataset, series } = options;
    const { mergeStart = 6, mergeText = '其他' } = datasetParams;
    const source = dataset.source.slice(0, mergeStart);
    const part2 = dataset.source.slice(mergeStart);
    if (part2[0]) {
      const sum = new Array(part2[0].length);
      sum.fill(0); //初始化sum
      sum[0] = mergeText;
      for (let i = 0; i < part2.length; i++) {
        for (let j = 1; j < part2[0].length; j++) {
          sum[j] += part2[i][j];
        }
      }
      source.push(sum);
      dataset.source = source;
      options.dataset = { source };
      options.series = series.slice(0, source.length - 1);
    }
  },
};

export default config;
