import { SpecificChartConfig } from '../../types';
import NP from 'number-precision';
import _ from 'lodash-es';

const seriesConfigs: { [key: string]: any } = {
  line: {
    type: 'line',
    showSymbol: false,
    label: { show: false },
  },
  bar: {
    type: 'bar',
    label: { show: false },
  },
  area: {
    type: 'line',
    label: { show: false },
    areaStyle: {},
  },
};

// 策略，y轴分5段，间隔数向上取整保留一位有效数字，
// max、min设定为两轴共同的最大、最小倍数乘以各自间隔

// 获取取整位数
// number > 0 : 35.05 => 1
// number < 0 : 0.0022 => 3
const getDigits = (value: number) => {
  const [intPart, decimalPart = ''] = value.toString().split('.');
  if (Math.abs(value) > 1) {
    return intPart.length - 1;
  } else {
    return decimalPart.length - decimalPart.replace(/^0*/, '').length + 1;
  }
};

const getInterval = (gap: number, offset = 0) => {
  const digits = getDigits(gap);
  let interval = gap;

  if (Math.abs(gap) > 1) {
    const dividend = Math.pow(10, digits - offset);
    const temp = NP.divide(gap, dividend);
    interval = NP.times(Math.ceil(temp), dividend);
  } else {
    const multiplier = Math.pow(10, digits + offset);
    const temp = NP.times(gap, multiplier);
    interval = NP.divide(Math.ceil(temp), multiplier);
  }
  return interval;
};

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {},
  },

  optionHandler(options, datasetParams = {}) {
    const { dataset, series = [] } = options;
    const { seriesTypes = ['line', 'bar'] } = datasetParams;

    let leftMax = 0;
    let leftMin = 0;
    let rightMin = 0;
    let rightMax = 0;

    for (let index = 1, l = dataset.source.length; index < l; index++) {
      const [name, ...list] = dataset.source[index];
      let type = 'line';

      // 右侧轴
      if (index === dataset.source.length - 1) {
        rightMin = Math.min(rightMin, ...list);
        rightMax = Math.max(rightMax, ...list);
        type = seriesTypes[1];
      } else {
        // 左侧轴
        leftMax = Math.max(leftMax, ...list);
        leftMin = Math.min(leftMin, ...list);
        type = seriesTypes[0];
      }

      const seriesConfig = seriesConfigs[type] || seriesConfigs.line;

      series.push({ ...seriesConfig });
    }

    const leftGap = NP.divide(NP.minus(leftMax, leftMin), 5);
    const leftInterval = getInterval(leftGap);
    let rightGap = NP.divide(NP.minus(rightMax, rightMin), 5);
    rightGap = NP.times(rightGap, NP.divide(leftInterval, leftGap));
    const rightInterval = getInterval(rightGap);

    const maxTimes = Math.max(
      Math.ceil(leftMax / leftInterval),
      Math.ceil(rightMax / rightInterval),
    );

    const minTimes = Math.min(
      Math.floor(leftMin / leftInterval),
      Math.floor(rightMin / rightInterval),
    );

    if (series.length > 1) {
      series[series.length - 1].yAxisIndex = 1;
    }

    options.series = series;
    options.yAxis = [
      {
        max: NP.times(leftInterval, maxTimes),
        min: NP.times(leftInterval, minTimes),
        interval: leftInterval,
        type: 'value',
      },
      {
        max: NP.times(rightInterval, maxTimes),
        min: NP.times(rightInterval, minTimes),
        interval: rightInterval,
        type: 'value',
      },
    ];
  },
};

export default config;
