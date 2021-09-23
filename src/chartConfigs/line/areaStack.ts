import { SpecificChartConfig } from '../../types';
import colorOpacity from '../../utils/colorOpacity';
import { merge } from 'lodash-es';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {},
  },

  optionHandler({ series }, datasetParams = {}, { themeConfig } = {}) {
    const { gradualColors = false } = datasetParams;
    const color = themeConfig?.color;

    series.forEach((item, i) => {
      const gradual = gradualColors
        ? {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: `${colorOpacity(color[i], 0.1)}`, // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: `${color[i]}`, // 100% 处的颜色
                },
              ],
            },
          }
        : {};
      merge(item, {
        stack: '总量',
        areaStyle: {
          opacity: 0.25,
          ...gradual,
        },
      });
    });
  },
};

export default config;
