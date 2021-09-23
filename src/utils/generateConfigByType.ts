import { merge, pick } from 'lodash-es';
import chartConfigs from '../chartConfigs';
import { ChartProps, OptionHandler, DatasetParams } from '../types';

// TODO: order
const superOrders = ['line', 'bar', 'doubleY'];
const subOrders = [
  'basic',
  'autoOther',
  'autoSum',
  'area',
  'areaStack',
  'maxTag',
  'markLine',
  'regression',
  'peak',
  'stack',
  'contrast',
  // style
  'reverse',
  'ring',
  'smooth',
  'symbol',
  'label',
  'hideSymbol',
  'autoYAxis',
];

const chartConfigMap = chartConfigs;

const generateConfigByType = (type: string) => {
  let typeList: string[] = [];
  let superTypes: string[] = [];
  const subTypes: string[] = [];

  type.split('&').forEach((item) => {
    superTypes.push(item.split('-')[0]);
    subTypes.push(item);
  });

  superTypes = superTypes.map((item) => {
    return item + '-basic';
  });

  typeList = typeList.concat(superTypes, subTypes).filter((item) => item.includes('-'));

  // sortBy subOrders
  typeList.sort((a, b) => {
    const index1 =
      subOrders.indexOf(a.split('-')[1]) === -1 ? Infinity : subOrders.indexOf(a.split('-')[1]);
    const index2 =
      subOrders.indexOf(b.split('-')[1]) === -1 ? Infinity : subOrders.indexOf(b.split('-')[1]);
    return index1 - index2;
  });

  // sortBy superOrders
  typeList.sort(
    (a, b) => superOrders.indexOf(a.split('-')[0]) - superOrders.indexOf(b.split('-')[0]),
  );

  typeList = Array.from(new Set(typeList));

  const chartProps: Partial<ChartProps> = {};
  const handlers: OptionHandler[] = [];
  const resizeHandler: any = [];
  typeList.forEach((type) => {
    if (chartConfigs[type]) {
      const { defaultChartProps, optionHandler, onResize } = chartConfigs[type];
      merge(chartProps, defaultChartProps);
      optionHandler && handlers.push(optionHandler);
      onResize && resizeHandler.push(onResize);
    } else {
      console.log(`不支持类型 ${type}`);
    }
  });

  const datasetHandler = (dataset: any, datasetParams: DatasetParams = {}, props = {}) => {
    const chartOptions = { dataset } as any;
    const isCombineType = typeList.length > 2;
    const globalParams = pick(
      datasetParams,
      Object.keys(datasetParams).filter((name) => name.startsWith('$')),
    );

    handlers.forEach((handler, i) => {
      const name = typeList[i].split('-')[1];
      const params = { ...globalParams };
      if (isCombineType) {
        merge(params, ...datasetParams[name]);
      } else {
        const typeParams = datasetParams[name] ? { ...datasetParams[name] } : datasetParams;
        merge(params, typeParams);
      }
      handler(chartOptions, params, props);
    });

    return chartOptions;
  };

  return { defaultChartProps: chartProps, datasetHandler, resizeHandler };
};

export const registerType = (typeConfig: Object) => {
  typeConfig &&
    Object.entries(typeConfig).forEach(([name, config]) => {
      chartConfigMap[name] = config;
    });
};

export default generateConfigByType;
