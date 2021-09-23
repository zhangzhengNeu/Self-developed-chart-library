import getStringLength from '../utils/getStringLength';
import baseThemeConfig from '../theme/base';

interface LegendConfig {
  legend?: {
    top?: string | number;
    right?: string | number;
    left?: string | number;
    orient?: string;
  };
  grid?: {
    top?: string | number;
    right?: string | number;
    left?: string | number;
    bottom?: string | number;
  };
}

interface LegendParam {
  placement?: string;
  width?: string | number;
}

const generateLegendConfig = (
  chartOptions: any,
  { placement = 'bottom', width = 'auto' }: LegendParam = {},
): LegendConfig => {
  if (placement === 'bottom') return {};

  const chartLegend = chartOptions?.legend;
  if (chartLegend.show === false) return {};

  const source = chartOptions?.dataset?.source || [];
  if (source?.length < 2 || !source[1][0]) return {};

  let legendWidth = width;

  if (width === 'auto') {
    const {
      legend: {
        textStyle: { fontSize = 12 },
        itemWidth = 12,
        padding = 5,
      },
    } = baseThemeConfig;

    const legendFontSize = chartLegend?.textStyle?.fontSize || fontSize;
    const legendItemWidth = chartLegend?.itemWidth || itemWidth;
    const legendItemPadding = chartLegend?.padding || padding;

    const longestWord = source
      .slice(1, source.length)
      .map((item: string[]) => getStringLength(item[0]))
      .sort((a: any, b: any) => b.length - a.length)[0];

    const { length, chineseCharLen, enCharLen } = longestWord;
    legendWidth = Math.max(
      Math.floor(length * legendFontSize * 0.55) +
        (legendItemWidth +
          (Array.isArray(legendItemPadding) ? legendItemPadding[1] : legendItemPadding)) +
        (enCharLen / chineseCharLen > 1 ? 30 : 0),
      80,
    );
  }
  let config: Record<string, any> = {};
  switch (placement) {
    case 'top':
    case 'topLeft':
    case 'topRight':
      config = {
        legend: {
          top: 'top',
        },
        grid: {
          top: 40,
          bottom: 15,
        },
      };
      if (placement === 'topLeft') config.legend.left = '3%';
      if (placement === 'topRight') config.legend.right = '3%';
      break;
    case 'right':
    case 'rightTop':
    case 'rightBottom':
      config = {
        legend: {
          orient: 'vertical',
          top: 'middle',
          right: 'right',
        },
        grid: {
          right: legendWidth,
          bottom: 15,
        },
      };
      if (placement === 'rightTop') config.legend.top = 'top';
      if (placement === 'rightBottom') config.legend.top = 'bottom';
      break;
    case 'left':
    case 'leftTop':
    case 'leftBottom':
      config = {
        legend: {
          orient: 'vertical',
          top: 'middle',
          left: 'left',
        },
        grid: {
          left: legendWidth,
          bottom: 15,
        },
      };
      if (placement === 'leftTop') config.legend.top = 'top';
      if (placement === 'leftBottom') config.legend.top = 'bottom';
      break;
    case 'bottomLeft':
    case 'bottomRight':
      config = {
        legend: {},
      };
      if (placement === 'bottomLeft') config.legend.left = 'left';
      if (placement === 'bottomRight') config.legend.left = 'right';
      break;
    default:
      break;
  }
  return config;
};

export default generateLegendConfig;
