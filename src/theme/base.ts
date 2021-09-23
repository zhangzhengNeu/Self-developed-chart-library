import tooltip from '../global/tooltip';

export default {
  backgroundColor: 'rgba(0,0,0,0)',
  // TODO:图表占据位置
  grid: {
    top: 30,
    left: '3%',
    right: '3%',
    bottom: 30,
    containLabel: true,
  },
  tooltip: {
    confine: true,
    show: true, // 默认显示，触发方式为坐标轴，并设置了边框和背景色
    trigger: 'axis',
    axisPointer: {
      type: 'line', // 默认为直线，可选为：'line' | 'shadow'
      lineStyle: {
        color: 'hsla(231, 51%, 78%, 0.5)',
      },
    },
    borderWidth: 0,
    padding: 10,
    extraCssText:
      'box-shadow: rgb(174, 174, 174) 0px 0px 10px; border-radius: 3px; line-height: 21px; padding: 10px 12px 8px',
    borderColor: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    textStyle: {
      // 字体样式
      color: '#666',
      fontSize: 12,
      fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      fontWeight: 400,
    },
    formatter: tooltip.formatter(),
  },
  legend: {
    // 图例默认显示，放在图表底部
    top: 'bottom',
    type: 'scroll',
    itemWidth: 12,
    itemHeight: 3,
    padding: 5,
    icon: 'rect',
    selectedMode: true,
    textStyle: {
      color: 'black',
      // fontWeight: 'bold',
      fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      fontSize: 12,
      lineHeight: 18,
    },
    formatter: function (text = '') {
      // 图例超过20个字显示...
      const maxLength = 20;
      return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
    },
  },
  categoryAxis: {
    splitLine: {
      // 默认chart上不显示x轴上的分割线
      show: false,
    },
    axisLine: {
      show: true,
      // 轴线为#ccc灰色
      lineStyle: {
        color: '#ccc',
      },
    },
    axisTick: {
      // 轴tick
      show: true,
      lineStyle: {
        color: '#ccc',
      },
      alignWithLabel: true,
    },
    axisLabel: {
      // 轴标签设置了默认的字体样式
      color: '#7F7F7F',
      fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      fontSize: 12,
      fontWeight: '300',
    },
    triggerEvent: true,
  },
  valueAxis: {
    splitLine: {
      // Y轴上默认显示分割线，为点线
      show: true,
      lineStyle: {
        type: 'dotted',
        width: 0.8,
      },
    },
    axisLine: {
      // 默认不显示轴线
      show: false,
      lineStyle: {
        color: '#ccc',
      },
    },
    axisTick: {
      // 默认不显示轴tick
      show: false,
    },
    axisLabel: {
      // 轴标签设置了默认的字体样式，字体样式同X轴
      color: '#7F7F7F',
      fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      fontSize: 12,
      fontWeight: '300',
    },
    triggerEvent: true,
  },
  line: {
    seriesLayoutBy: 'row',
    showSymbol: true,
    showAllSymbol: false,
    label: { show: true },
  },
  pie: {
    seriesLayoutBy: 'row',
    label: { show: true },
    tooltip: { trigger: 'item' },
    legend: false,
  },
  bar: { seriesLayoutBy: 'row', barMaxWidth: '55%' },
  scatter: { seriesLayoutBy: 'row' },
  funnel: { seriesLayoutBy: 'row', tooltip: { trigger: 'item' } },
  map: { seriesLayoutBy: 'row' },
  wordCloud: { seriesLayoutBy: 'row', tooltip: { trigger: 'item' } },
};
