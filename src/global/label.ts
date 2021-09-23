import { chartInReverse, valueFilter, getExtremum } from '../utils';
import { getFormatter, NumeraTypeName } from '../utils/valueFormat';

interface RenderLabel {
  scope: 'axis' | 'tooltip' | 'series' | 'all' | '';
  type: NumeraTypeName;
  prefix: string;
  suffix: string;
  formatter: (value: number | string, formattedData: number | string, index: number) => void;
}

const localFormatter = (renderLabel: RenderLabel, maxValue?: number) => {
  if (!renderLabel) return;
  const { type = 'number', prefix = '', suffix = '', formatter } = renderLabel;
  const func = getFormatter(type);

  if (!func && !prefix && !suffix && !formatter) return;

  const formatValue = (value: any) => prefix + (func ? func(value, { maxValue }) : value) + suffix;
  return typeof formatter === 'function'
    ? (value: any, index: number) => formatter(value, formatValue(value), index)
    : (value: any, index: number) => formatValue(value);
};

/**
 * 数值轴的格式化
 * @param formatter 每项的格式化函数
 */
const formatAxis = (formatter: Function) => {
  return {
    axisLabel: {
      formatter: (value: string | number, index: number) => {
        return formatter(value);
      },
    },
  };
};

/**
 * 系列label格式化
 * @param formatter 每项的格式化函数
 */
export const formatDataLabel = (formatter: Function) => {
  return (params: any) => {
    const { seriesIndex = -1, value } = params;
    return formatter(value[seriesIndex + 1]);
  };
};

export const getConfig = (
  config: any = {},
  showAxis: boolean = true,
  maxValue?: number | undefined,
) => {
  const { scope = '', type = 'number' } = config;
  // 默认abbr，等同于axis
  let newScope = scope === '' && type === 'abbr' ? 'axis' : scope;
  const formatter: any = localFormatter(config, maxValue);
  let fun: any = {};

  if (['all', ''].includes(newScope)) {
    fun = { axis: formatter, tooltip: formatter, series: formatter };
  } else {
    const numberF: any =
      type === 'number' ? formatter : localFormatter({ ...config, type: 'number' });
    fun = { axis: numberF, tooltip: numberF, series: numberF, [newScope]: formatter };
  }

  return {
    $tooltip: { formatter: fun.tooltip },
    axis: showAxis ? formatAxis(fun.axis) : {},
    series: formatDataLabel(fun.series),
    formatter: fun,
  };
};

/**
 * 双轴图不支持tooltips格式化
 */
export default (chartOptions: any, datasetParams: any, data: any, isDoubleY: boolean) => {
  const { target, source } = data || {};
  const { $renderLabel = { type: 'number' } } = datasetParams || {};
  if (!target || !$renderLabel) return {};

  const { xAxis, yAxis, series } = chartOptions;
  const valueAxisName = chartInReverse(xAxis, yAxis) ? 'xAxis' : 'yAxis';
  const axisOption = chartOptions[valueAxisName] || {};

  const getLabelConfig = (config: any = {}, sliceStart: number = 1, sliceEnd: any = undefined) => {
    const { type } = config;
    let maxValue: number | undefined = undefined;
    if (type === 'abbr') {
      maxValue = getExtremum.axisMax(chartOptions);
    }
    return getConfig(config, axisOption.show, maxValue);
  };

  let labelConfig = $renderLabel;
  if (Array.isArray($renderLabel) && (!isDoubleY || $renderLabel.length === 1)) {
    labelConfig = $renderLabel[0];
  }

  // 双轴图
  if (isDoubleY) {
    const config0 = getLabelConfig(labelConfig[0] || labelConfig, 1, -1);
    const config1 = getLabelConfig(labelConfig[1] || labelConfig, -1);

    return {
      $tooltip: config0?.$tooltip,
      config: { [valueAxisName]: [config0?.axis, config1?.axis] },
    };
  } else {
    const config = getLabelConfig(labelConfig);

    if (!config) return {};

    series?.forEach((item: any) => {
      item.label = { formatter: config.series, ...item.label };
    });

    return { $tooltip: config.$tooltip, config: { [valueAxisName]: config.axis } };
  }
};
