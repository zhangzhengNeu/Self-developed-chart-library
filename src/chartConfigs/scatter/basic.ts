import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {},
  },
  optionHandler(options) {
    const { dataset } = options;
    const length = dataset.source.length - 1;
    options.series = new Array(length).fill({}).map((item, index) => {
      const name = dataset.source[index + 1][0];
      return { type: 'scatter' };
    });
  },
};

export default config;
