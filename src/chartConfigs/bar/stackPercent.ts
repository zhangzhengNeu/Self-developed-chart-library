import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    datasetParams: {
      $renderLabel: {
        type: '.2percent',
      },
    },
  },

  optionHandler(options) {
    const {
      dataset: { source = [] },
      series,
    } = options;
    const valArr = source.slice(1);

    const total = valArr.reduce(
      (pre: any, cur: any) =>
        pre.map((val: number, index: number) => (index === 0 ? val : val + (+cur[index] || 0))),
      new Array(source[0].length).fill(0),
    );

    const percentVals = valArr.map((item: any) =>
      item.map((val: number, index: number) => (index === 0 ? val : val / (total[index] || 1))),
    );

    options.dataset.source = [source[0], ...percentVals];

    series.forEach((item, index) => {
      merge(item, {
        stack: source[0][0],
      });
    });
  },
};

export default config;
