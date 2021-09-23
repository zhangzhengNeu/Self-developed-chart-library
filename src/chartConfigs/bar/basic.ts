import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {
      tooltip: {
        axisPointer: {
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(213, 218, 246, 0.25)',
          },
          z: 0,
        },
      },
    },
  },

  optionHandler(options) {
    const { dataset } = options;
    const length = dataset.source.length - 1;
    options.series = new Array(length).fill({}).map((item, i) => {
      return { type: 'bar' };
    });
  },
};

export default config;
