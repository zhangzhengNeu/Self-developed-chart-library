import { renderNumeralMap } from '../../utils';
import { SpecificChartConfig } from '../../types';
import { getConfig } from '../../global/label';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {
      xAxis: { show: false },
    },
    datasetParams: {
      sort: 'default',
      $tooltip: {
        valueKeys: ['value', 'rate'],
      },
    },
  },
  optionHandler(options, datasetParams) {
    const { dataset } = options;
    const { $renderLabel = {} } = datasetParams;
    const sort = datasetParams!.sort;

    const length = dataset.source.length - 1;

    const [firstName, ...names] = dataset.source[0];
    const [firstValue, ...values] = dataset.source[1];

    const {
      formatter: { series: valueFormat },
    } = getConfig($renderLabel);

    interface Item {
      name: string;
      value: number;
    }

    const items = names.map((name: string, index: number) => ({ name, value: values[index] }));

    if (!(sort === 'none')) {
      items.sort((a: Item, b: Item) => b.value - a.value);
    }

    options.series = new Array(length).fill({}).map((item, i) => {
      const data = items.map(({ name, value }: Item, index: number) => {
        const preValue = items[Math.max(index - 1, 0)].value;
        const rate = renderNumeralMap.percent(value / preValue);

        return { name, value, rate: `(${rate})` };
      });

      return {
        type: 'funnel',
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            const { data: { name = '', value = '' } = {} } = params;
            return name + ' ' + valueFormat(value);
          },
        },
        top: 30,
        bottom: 25,
        sort,
        data,
      };
    });
  },
};

export default config;
