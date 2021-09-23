import { SpecificChartConfig } from '../../types';
import { chartInReverse } from '../../utils';
import { merge } from 'lodash-es';

const defaultHide = {
  axisLine: {
    show:false // 是否显示坐标轴轴线。
  },
  splitLine: {
    show: false // 是否显示分隔线
  },
  axisTick: { // 是否显示坐标轴刻度
    show: false
  },
  // axisPointer: { // 是否显示柱子 hover 效果指示器：line/shadow
  //   show: false
  // },
}

const horizontal = {
  xAxis: {
    show: false, // 是否显示 x 轴。
    ...defaultHide
  },
  yAxis: {
    show: true, // 是否显示 y 轴。
    ...defaultHide
  },
  grid: {
    top: 15
  }
}

const vertical = {
  xAxis: {
    show: true, // 是否显示 x 轴。
    ...defaultHide
  },
  yAxis: {
    show: false, // 是否显示 y 轴。
    ...defaultHide
  },
}

const hideAxis = (xAxis: {[index:string]: any}, yAxis: {[index:string]: any}) => {
  return chartInReverse(xAxis, yAxis) ? horizontal : vertical;
}

// hideAxis 隐藏 x 轴、y 轴、分隔线
const config: SpecificChartConfig = {
  defaultChartProps: {},
  optionHandler: (options) => {
    const {xAxis, yAxis} = options;
    merge(options, hideAxis(xAxis, yAxis));
  }
}

export default config;
