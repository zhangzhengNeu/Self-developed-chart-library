import chartInReverse from './chartInReverse';

export const maxValue = (chartOptions: any, sliceStart: number = 1, sliceEnd: any = undefined) => {
  const { xAxis, yAxis, dataset: { source } = {} } = chartOptions || {};
  const valueAxisName = chartInReverse(xAxis, yAxis) ? 'xAxis' : 'yAxis';
  const axisOption = chartOptions[valueAxisName] || {};
  const valueArr =
    source
      ?.slice(sliceStart, sliceEnd)
      .map((item: any) => item.slice(1).filter((val: any) => typeof isNaN(+val))) || [];

  return +axisOption.max || Math.max.apply(Math, valueArr.flat());
};

export default {
  maxValue,
};
