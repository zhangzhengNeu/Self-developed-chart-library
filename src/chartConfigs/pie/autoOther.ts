import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler(options, datasetParams = {}) {
    const { dataset } = options;
    const { mergeStart = 6, mergeText = '其他' } = datasetParams;
    const [nameList, dataList = []] = dataset.source;
    let sum = 0;

    nameList.splice(mergeStart, Infinity, mergeText);

    if (dataList.length - 1 <= mergeStart) {
      return;
    }

    for (let i = mergeStart; i < dataList.length; i++) {
      sum = sum + dataList[i];
    }

    dataList.splice(mergeStart, Infinity, sum);
  },
};

export default config;
