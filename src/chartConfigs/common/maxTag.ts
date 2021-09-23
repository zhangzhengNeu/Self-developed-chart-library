import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';
import { getConfig } from '../../global/label';

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler({ series }, { $renderLabel = {} } = {}) {
    const {
      formatter: { series: valueFormat },
    } = getConfig($renderLabel);
    series.forEach((item) => {
      merge(item, {
        showSymbol: false,
        label: { show: false },
        markPoint: {
          symbol: 'pin',
          symbolSize: 20,
          itemStyle: {
            color: 'transparent',
          },
          label: {
            color: 'orangered',
            formatter: (params: any) => {
              return ['line', 'bar'].includes(item.type || '')
                ? valueFormat(params.value)
                : params.value;
            },
          },
          data: [{ type: 'max', name: '最大值' }],
        },
      });
    });
  },
};

export default config;
