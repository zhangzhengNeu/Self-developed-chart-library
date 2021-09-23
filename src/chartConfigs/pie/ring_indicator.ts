import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {},
  },
  optionHandler(options, datasetParams = {}) {
    const { radius = ['40%', '60%'], sumKey = null, name = '', value = '' } = datasetParams;
    const {
      series,
      dataset: { source, target },
    } = options;
    const sourceIndex = sumKey ? target.findIndex(({ key }: { key: string }) => key === sumKey) : 1;
    const totalSum =
      value |
      source[sourceIndex === -1 ? 1 : sourceIndex].reduce(
        (sum: number, count: number, cursor: number) => cursor !== 0 && sum + count,
        [0],
      );
    options.graphic = [
      {
        type: 'text',
        top: '44%',
        left: 'center',
        z: 10,
        style: {
          text: name ? name : '总计',
          textAlign: 'center',
          fill: '#ababab',
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '50%',
        z: 10,
        style: {
          text: totalSum.toString().replace(/\B(?=(?:\d{3})+$)/g, ','),
          textAlign: 'center',
          fill: '#000',
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
    ];
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
