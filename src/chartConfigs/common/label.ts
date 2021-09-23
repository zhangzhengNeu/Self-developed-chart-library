import { SpecificChartConfig } from '../../types';
import { getConfig } from '../../global/label';
import { chartInReverse } from '../../utils';

// bar 横向 label 显示居左
const barReverseLabelLeft = (
  xAxis: { [index: string]: any },
  yAxis: { [index: string]: any },
  seriesItem: any,
  position: any,
) => {
  if (
    chartInReverse(xAxis, yAxis) &&
    seriesItem.type === 'bar' &&
    seriesItem.label &&
    seriesItem.label.show
  ) {
    seriesItem.label = {
      ...seriesItem.label,
      ...(!position
        ? {
            position: 'insideLeft', // 标签的位置 居左
            offset: [5, 0], // 在 position 基础上向左偏移 5
          }
        : { position }),
    };
  }
  return seriesItem;
};

const config: SpecificChartConfig = {
  defaultChartProps: {},
  optionHandler(options, datasetParams = {}) {
    const { dataset, series, xAxis, yAxis } = options;
    const {
      showAllLabel = false,
      showLabel = true,
      showPercentage = false,
      position,
      $renderLabel,
    } = datasetParams;
    const length = dataset.source[0].length - 1;
    const gap = ~~(length / 4);

    // 加个标志
    options.showLabel = true;
    const {
      series: labelFormat,
      formatter: { series: valueFormat },
    } = getConfig($renderLabel);

    const calPercentage = (seriesIndex: number, value: []) => {
      const valueArray = dataset.source[seriesIndex + 1];
      const valueSum = (valueArray: []) => {
        let sum = 0;
        for (var i = valueArray.length - 1; i >= 1; i--) {
          sum += valueArray[i];
        }
        return sum;
      };
      const sum = valueSum(valueArray);
      let percentage = ((value[seriesIndex + 1] / sum) * 100).toFixed(2) + '%';
      return percentage;
    };

    series.forEach((item: any, i: number) => {
      item.label = {
        show: showLabel,
      };
      // bar 横向 label 显示居左
      item = barReverseLabelLeft(xAxis, yAxis, item, position);
      if (item.type === 'line') {
        item.showAllSymbol = true;
        if (showAllLabel || (!showAllLabel && length < 5)) {
          item.label.formatter = labelFormat;
        } else {
          item.label.formatter = (params: any) => {
            const { seriesIndex, dataIndex, value } = params;
            const isShow = length === dataIndex + 1 || [0, 1, 2, 3].includes(dataIndex / gap);
            const val = valueFormat ? valueFormat(value[seriesIndex + 1]) : value[seriesIndex + 1];
            return isShow ? val : ' ';
          };
        }
      } else if (item.type === 'bar') {
        if (showPercentage) {
          item.label.formatter = (params: any) => {
            const { seriesIndex, value } = params;
            const percentage = calPercentage(seriesIndex, value);
            return valueFormat(value[seriesIndex + 1]) + `  (${percentage})`;
          };
        } else {
          item.label.formatter = labelFormat;
        }
      }
    });
  },
};

export default config;
