import { merge } from 'lodash-es';
import base from './base';

const dark = {
  color: [
    '#55ACEE',
    '#4CDFC0',
    '#FF9945',
    '#FACF2A',
    '#788CF0',
    '#2DCA93',
    '#FFC57F',
    '#5F73F3',
    '#F0938A',
    '#68D9F0',
    '#E1B13A',
    '#AB9EDC',
    '#71DB9E',
    '#B99371',
    '#57D4CF',
    '#EE7A7A',
    '#F7E16A',
    '#409EFF',
    '#E79734',
    '#B2C9FF',
    '#27D29C',
    '#E0CD9E',
    '#428CC1',
    '#DCC510',
    '#F2BCB5',
    '#59ABFF',
    '#7DC050',
    '#A3E8E5',
  ],
  backgroundColor: '#222',
  legend: {
    inactiveColor: '#777',
    textStyle: {
      color: '#a8a8a8',
    },
  },
  categoryAxis: {
    axisLabel: {
      textStyle: {
        color: '#989898',
      },
    },
    axisLine: {
      lineStyle: {
        color: '#777',
      },
    },
    axisTick: {
      lineStyle: {
        color: '#777',
      },
    },
  },
  valueAxis: {
    splitLine: {
      lineStyle: {
        color: '#555',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#989898',
      },
    },
  },
  tooltip: {
    extraCssText:
      'box-shadow: rgb(51, 51, 51) 0px 0px 10px; border-radius: 3px; line-height: 20px; padding: 10px 10px 6px',
    backgroundColor: 'rgba(51, 51, 51, 0.95)',
    textStyle: {
      // 字体样式
      color: '#bbb',
    },
  },
};
export default merge({}, base, dark);
