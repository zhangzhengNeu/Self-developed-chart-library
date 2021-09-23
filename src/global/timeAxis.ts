import { merge } from 'lodash-es';
import Echarts from 'echarts';
import { chartInReverse } from '../utils';

const splitTime = (value: any) => {
  return Echarts.format.formatTime('yyyy-M-d hh:mm:ss', value).split(/[\-\s\:]/);
};

/**
 * 时间格式化
 * @param dateTexts
 * @param unit
 * @param isFull 是否全部显示
 */
const timeFormat = (dateTexts: string[], unit = 'd', isFull = false) => {
  const unitMap: any = { y: 1, M: 2, d: 3, h: 5, m: 5, s: 6 };
  let texts: any = [];

  if (isFull) {
    if (unitMap[unit] > 3) {
      return dateTexts.slice(3, unitMap[unit]).join(':') + '\n' + dateTexts.slice(0, 3).join('-');
    } else {
      return dateTexts.slice(0, unitMap[unit] || 2).join('-');
    }
  }

  switch (unit) {
    case 'y':
      texts = dateTexts[0] + '年';
      break;
    case 'M':
      texts = dateTexts[1] + '月';
      break;
    case 'd':
      texts = dateTexts.slice(1, 3).join('-');
      break;
    case 'h':
      texts = dateTexts[3] + ':00';
      break;
    case 'm':
      texts = dateTexts.slice(3, 5).join(':');
      break;
    case 's':
      texts = dateTexts.slice(3, 6).join(':');
      break;
    default:
      texts = dateTexts.slice(1, 3).join('-');
  }
  return texts;
};

export default (chartOptions: any, datasetParams: any, echarts: any) => {
  const { $timeAxis: { show = false, grain = 'd' } = {} } = datasetParams || {};

  if (!echarts || !show) return;

  const option = merge({}, echarts._theme, chartOptions);
  const { xAxis, yAxis } = option;
  // 时间轴是否为Y轴
  const timeIsYAxis = chartInReverse(xAxis, yAxis);

  // 显示在轴上的数据index
  let axisDatas: any = [];

  return {
    [timeIsYAxis ? 'yAxis' : 'xAxis']: {
      axisLabel: {
        formatter: (value: string, index: number) => {
          const dateTexts = splitTime(value);
          const { index: lastIndex } = axisDatas.slice(-1)[0] || {};

          // 第一个（数据缩放时，第一个index不一定为0）
          if (lastIndex > index) {
            axisDatas = [{ index, value }];
          } else {
            axisDatas.push({ index, value });
          }

          // 取前一个
          const { index: prevIndex, value: prevValue } = axisDatas.slice(-2, -1)[0] || {};
          const prevDate = splitTime(prevValue);

          // 第一个
          // 和上一个显示在轴上的日期相比跨年
          if ((!prevIndex && prevIndex !== 0) || prevDate[0] !== dateTexts[0]) {
            return timeFormat(dateTexts, grain, true);
          } else if (
            ['h', 'm', 's'].includes(grain) &&
            prevIndex >= 0 &&
            prevDate[2] !== dateTexts[2]
          ) {
            // 跨天
            return timeFormat(dateTexts, grain) + '\n' + timeFormat(dateTexts, 'd');
          } else {
            return timeFormat(dateTexts, grain);
          }
        },
      },
    },
  };
};
