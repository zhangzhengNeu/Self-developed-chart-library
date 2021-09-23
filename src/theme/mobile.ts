import base from './base';

export default {
  grid: {
    top: 15,
    left: '3%',
    right: '3%',
    bottom: 28,
    containLabel: true,
  },
  categoryAxis: {
    axisLabel: {
      formatter: function (text = '') {
        if (!text) return text;
        // 图例超过20个字显示...
        const maxLength = 20;
        return text.length > maxLength ? text.substr(0, maxLength) + '...' : text;
      },
    },
  },
};
