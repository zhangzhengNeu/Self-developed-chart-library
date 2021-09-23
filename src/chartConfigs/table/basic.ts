import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {
      table: {
        dataSource: [],
        columns: [],
      },
    },
  },

  optionHandler(chartOptions, datasetParams = {}) {
    const { dataset } = chartOptions;
    const { ingoreCols = [], columns: columnsProps = {} } = datasetParams;
    const { source } = dataset;

    const length = dataset.source[0].length;
    const dataSource = [];

    chartOptions.table = {};

    if (length <= 1) {
      return;
    }
    const columns = source
      .map((item: any) => {
        const name = item[0];
        const props = columnsProps[name] || {};
        return {
          title: name,
          name: name,
          code: name,
          key: name,
          align: props.align,
          formatter: props.formatter,
          hidden:ingoreCols.includes(name),
          features: { sortable: true },
        };
      })

    for (let i = 1; i < length; i++) {
      const data: any = {};
      columns.forEach((item: any, j: number) => {
        data[item.name] = source[j][i];
        data.key = i;
      });
      dataSource.push(data);
    }
    chartOptions.table = {
      columns,
      dataSource,
      datasetParams,
    };
  },
};

export default config;
