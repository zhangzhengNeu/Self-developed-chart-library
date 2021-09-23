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

    if (dataset.source.length > 3) {
      console.warn('funnel-contrast仅支持两组数据对比!');
    }

    const {
      formatter: { series: valueFormat },
    } = getConfig($renderLabel);

    interface Item {
      name: string;
      value: number;
    }

    const [first, ...names] = dataset.source[0];

    const generateData = (index: number) => {
      const values = dataset.source[1][index];
      const items = names.map((name: string, index: number) => ({ name, value: values[index] }));

      if (!(sort === 'none')) {
        items.sort((a: Item, b: Item) => b.value - a.value);
      }

      return items.map(({ name, value }: Item, index: number) => {
        const preValue = items[Math.max(index - 1, 0)].value;
        const rate = renderNumeralMap.percent(value / preValue);

        return { name, value, rate: `(${rate})` };
      });
    };

    const label = {
      show: true,
      position: 'inside',
      formatter: (params: any) => {
        const { data: { name = '', value = '' } = {} } = params;
        return name + ' ' + valueFormat(value);
      },
    };

    const leftSerie = {
      type: 'funnel',
      funnelAlign: 'right',
      right: '50%',
      label,
      top: 30,
      bottom: 25,
      sort,
      data: generateData(1),
    };

    const rightSerie = {
      type: 'funnel',
      funnelAlign: 'left',
      left: '50%',
      label,
      top: 30,
      bottom: 25,
      sort,
      data: generateData(2),
    };

    options.series = [leftSerie, rightSerie];
  },
};

export default config;
