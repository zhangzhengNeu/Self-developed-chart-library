import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {},
    // datasetParams: {
    //   $renderLabel: {
    //     type: 'number',
    //   },
    // },
  },
  optionHandler(options) {
    const { dataset } = options;
    const length = dataset.source.length - 1;
    options.series = new Array(length).fill({}).map((item, i) => {
      return { type: 'line' };
    });
  },
};

export default config;
