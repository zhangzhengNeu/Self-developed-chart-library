import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler(options) {
    const { dataset } = options;
    const labelArray: any = [];
    const years: any = {};
    if (dataset.source[0]) {
      dataset.source[0].slice(1).forEach((item: any) => {
        const date = new Date(item);
        const texts: any = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        if (years[texts[0]]) {
          texts.shift();
        } else {
          years[texts[0]] = true;
        }
        labelArray.push(texts.join('-'));
      });
    }
    const xAxis = {
      axisLabel: {
        formatter: (v: any, i: number) => labelArray[i],
      },
    };
    options.xAxis = xAxis;
    options.dataset = dataset;
  },
};

export default config;
