import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler(chartOptions, datasetParams = {}) {
    chartOptions.table.datasetParams = datasetParams;
  },
};

export default config;
