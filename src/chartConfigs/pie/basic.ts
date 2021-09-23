import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {
      xAxis: { show: false },
    },
  },
  optionHandler(options) {
    const { dataset } = options;
    const length = dataset.source.length - 1;
    const series = [];
    for (let index = 0; index < length; index++) {
      const name = dataset.source[index + 1][0];
      series.push({
        type: 'pie',
        radius: [0, '60%'],
        label: {
          formatter: '{b}',
        },
      });
    }
    options.series = series;
  },
};

export default config;
