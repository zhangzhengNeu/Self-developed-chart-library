import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {
      xAxis: {
        show: false, //!important ...
      },
      yAxis: {
        show: false, //!important ...
      },
      legend: { show: false },
      tooltip: { trigger: 'item' },
    },
  },

  optionHandler(options, datasetParams = {}) {
    const { dataset } = options;
    const { mapType = '100000', areaColor = '#eee', borderColor = '#fff' } = datasetParams;
    let max = 0;
    let min = 0;

    const data = dataset.source[1];

    if (data) {
      for (let i = 1; i < data.length; i++) {
        const value = data[i];
        max = Math.max(max, value);
        min = Math.min(min, value);
      }
    }

    options.visualMap = {
      max,
      min,
      text: ['多', '少'],
      realtime: false,
      inRange: {
        color: ['#fff', '#5f7af1'],
      },
    };

    options.series = [
      {
        type: 'map',
        //adcode
        mapType,
        layoutCenter: ['50%', '60%'],
        layoutSize: '100%',

        itemStyle: {
          areaColor,
          borderColor,
        },
        label: {
          formatter: '{b}',
        },
      },
    ];
  },
};

export default config;
