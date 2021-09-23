import { SpecificChartConfig } from '../../types';
import { chartInReverse } from '../../utils';
import { merge } from 'lodash-es';

// percent 显示转化率
const config: SpecificChartConfig = {
  defaultChartProps: {},
  optionHandler: (options, datasetParams) => {
    const { dataset, series, xAxis, yAxis } = options;
    // 只处理一个系列的情况
    if (series && series.length === 1 && dataset && dataset.source && dataset.source.length > 1) {
      let originArr = [...dataset.source[1]];
      originArr.shift(); // 剔除第一项 标题，取真实的数据，用于计算百分比

      // 在 series 中新增一个序列用于显示 百分比
      const newSeries = chartInReverse(xAxis, yAxis)
        ? horizontal(series, originArr, datasetParams)
        : vertical(series, originArr, datasetParams);
      return merge(options, newSeries);
    }
  },
};

export default config;

// 处理 横向 百分比
function horizontal(series: { [index: string]: any }[], originArr: number[], datasetParams: any) {
  const { barWidth = 'auto', barCategoryGap = 30 } = datasetParams || {};

  series[0].barCategoryGap = barCategoryGap;
  series[0].barWidth = barWidth;
  series[0].barMaxWidth = '40%';

  series.push({
    name: '',
    type: 'pictorialBar',
    symbolBoundingData: 70,
    barWidth: '100%',
    symbolSize: [70, '40%'],
    symbolOffset: [0, '-120%'],
    symbolRepeat: false,
    hoverAnimation: false,
    cursor: 'auto',
    symbol: 'path://M171.571,263.667v-48.81h108.333v48.81l-54.167,19.048L171.571,263.667z',
    color: 'rgba(221, 221, 221, 0.4)',
    emphasis: {
      itemStyle: {
        color: 'rgba(221, 221, 221, 0.4)'
      },
    },
    z: 110,
    tooltip: { show: false },
    label: {
      position: 'top',
      offset: [0, 10],
    },
    data: calculateRate(originArr, true),
  });

  return {
    series,
  };
}

// 处理 竖向 百分比
function vertical(series: { [index: string]: any }[], originArr: number[], datasetParams: any) {
  
  const { barWidth = 'auto', barCategoryGap = 30 } = datasetParams || {};

  series[0].barCategoryGap = barCategoryGap;
  series[0].barWidth = barWidth;
  series[0].barMaxWidth = '40%';

  series.push({
    name: '',
    type: 'pictorialBar',
    symbolBoundingData: 40,
    barWidth: '100%',
    symbolSize: ['50%', 40],
    symbolOffset: ['100%', -25],
    symbolRepeat: false,
    hoverAnimation: false,
    cursor: 'auto',
    symbol: 'path://M0,0 L30,0 L40,40 L30,80 L0,80Z',
    color: 'rgba(221, 221, 221, 0.4)',
    emphasis: {
      itemStyle: {
        color: 'rgba(221, 221, 221, 0.4)'
      },
    },
    z: 110,
    tooltip: { show: false },
    label: {
      position: 'right',
      offset: [-29, -13]
    },
    data: calculateRate(originArr, false),
  });

  return {
    series,
  };
}
// 根据源数据，计算得出对应百分比的 series 的数据项
function calculateRate(originArr: number[], isReverse: boolean) {
  let rateData = arrPercent(originArr, isReverse);

  let seriesRate = rateData.map((v) => {
    let item = {
      value: 0,
      label: {
        show: true,
        color: '#000',
        formatter: v + '%',
      },
    };
    return item;
  });

  return seriesRate;
}

// 根据源数据，计算得出对应百分比数据
function arrPercent(arr: number[], isReverse: boolean) {
  let res = [];

  if (arr && Array.isArray(arr)) {
    let newArr = [...arr];
    isReverse && newArr.reverse();
    for (let i = 1; i < newArr.length; i++) {
      const rate = (newArr[i] / newArr[i - 1]) * 100;
      res.push(rate.toFixed(2));
    }
  }

  isReverse && res.reverse();
  return res;
}
