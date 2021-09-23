import { SpecificChartConfig } from '../../types';
import { chartInReverse } from '../../utils';
import { merge, cloneDeep } from 'lodash-es';
import { getConfig } from '../../global/label';

// percent 显示转化率
const config: SpecificChartConfig = {
  defaultChartProps: {
    datasetParams: {
      $tooltip: {
        valueKeys: ['range'],
      },
    },
  },
  optionHandler: (options, datasetParams = {}) => {
    let { dataset, xAxis = {}, yAxis = {}, showLabel = false } = options;
    const { $renderLabel = {} } = datasetParams;

    const { pureArr, nameArr, categoryArr } = getPureArr(dataset.source);
    const isReverse = chartInReverse(xAxis, yAxis) as boolean;
    const {
      formatter: { series: valueFormat },
    } = getConfig($renderLabel);

    let newSeries: any = [];
    pureArr.forEach((item: any, i: number) => {
      newSeries = [
        ...newSeries,
        ...createSeries(item, nameArr[i], showLabel, isReverse, valueFormat),
      ];
    });

    // 处理轴类目名称显示
    const axisLine = {
      // 当有负值的时候，不以0作为轴心
      onZero: false,
    };
    if (isReverse) {
      options.yAxis = { ...yAxis, data: categoryArr, axisLine };
    } else {
      options.xAxis = { ...xAxis, data: categoryArr, axisLine };
    }

    return merge(options, { series: newSeries });
  },
};

export default config;

// 源数据处理，获取纯数据
function getPureArr(arr: any[]) {
  let pureArr = cloneDeep(arr);
  let nameArr: any[] = [];

  const categoryArr = pureArr.shift(); // 剔除第一项 标题，取数据
  categoryArr.shift();

  pureArr.forEach((item: any) => {
    nameArr.push(item.shift());
  });
  return {
    pureArr, // 多维数据
    nameArr, // 多维数据对应的名称
    categoryArr, // 轴类目名称
  };
}

// 轴数据处理
function dataFormat(data: number[][], name: string, isReverse: boolean, valueFormat: Function) {
  let min: number[] = []; // 区间的最小值, 堆叠，透明
  let max: any[] = []; // 区间的最大值, 堆叠，显示
  let negative: number[] = []; // 负值处理，堆叠，显示负值的部分，max仅显示了正值的部分。特殊情况，区间最小值为负值，最大值为正值。
  let minLabel: any[] = []; // 显示区间的最小值的 label 数据，在 max 上通过 markpoint 实现，以控制 label 颜色值和显示的柱子颜色值一致，并且显示隐藏有效

  // 对数据排序，后面需要找到整组数据中最小值
  let sortData = cloneDeep(data);
  sortData.sort((a, b) => a[0] - b[0]);

  data.forEach((item, i) => {
    // 取哪个值作为透明底层(从0开始)，[-min, +max]->0不需要透明; [-min, -max]->-max到0填充透明；[+min,+max]->0到+min填充透明
    min.push(item[1] <= 0 ? item[1] : item[0] <= 0 ? 0 : item[0]);
    // 主要处理[-min,+max]情况，填充显示-min的部分。其他情况不需要填充，为0。
    negative.push(item[1] <= 0 || item[0] >= 0 ? 0 : item[0]);

    // 横向：coord: [offsetx，y]，等同于 xAxis: offsetx, yAxis: y。其中，offsetx 表示偏移值，y 表示bar的索引。
    // 竖向：[x, offsety]
    const coord = isReverse ? [item[0], i] : [i, item[0]];
    minLabel.push({
      value: item[0], // 对值进行格式化
      coord: item[0] || sortData[0][0] ? coord : [], // 当最小值不为0的时候，都要显示
    });

    max.push({
      // // 差值作为叠加值，在透明层的数据上叠加。[-min, +max]->0到max,不需要堆叠进行差值计算; [+min, +max]->+max - +min需要计算差值；[-min,-max]->-min - -max需要计算差值
      value: item[1] <= 0 ? item[0] - item[1] : item[0] <= 0 ? item[1] : item[1] - item[0],
      range: `${valueFormat(item[0])} - ${valueFormat(item[1])}`, // tooltip 显示
      name, // legend 显示
      label: {
        formatter: valueFormat(item[1]), // 最终值作为显示值
      },
      itemStyle: {
        color: item[2],
      },
    });
  });

  return {
    min,
    max,
    negative,
    minLabel,
  };
}

// 生成序列数据
function createSeries(
  arr: number[][],
  name: string,
  showLabel: boolean,
  isReverse: boolean,
  valueFormat: Function,
) {
  let newSeries: any = [];
  const { min, max, minLabel, negative } = dataFormat(arr, name, isReverse, valueFormat);

  const maxPosition = isReverse ? 'right' : 'top';
  const minPosition = isReverse ? 'left' : 'bottom';

  newSeries = [
    // 作为堆叠辅助，不显示
    {
      type: 'bar',
      stack: name,
      tooltip: {
        show: false,
      },
      // 透明
      itemStyle: {
        barBorderColor: 'rgba(0,0,0,0)',
        color: 'rgba(0,0,0,0)',
      },
      emphasis: {
        itemStyle: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)',
        },
      },
      label: {
        show: false,
      },
      data: min,
    },
    // 当区间[负值，正值]时，用于显示负值的部分
    {
      type: 'bar',
      stack: name,
      name: name, // 名称和max相同，保证柱子统一颜色
      tooltip: {
        show: false,
      },
      label: {
        show: false,
      },
      data: negative,
    },
    // 用于显示正值的部分
    {
      type: 'bar',
      stack: name,
      name: name,
      tooltip: {
        show: true,
      },
      label: {
        show: showLabel,
        position: maxPosition,
      },
      markPoint: {
        symbol: 'rect',
        // 图形上面的小头隐藏
        symbolSize: 0.000000000000001,
        label: {
          show: showLabel,
          position: minPosition,
        },
        data: minLabel,
      },
      data: max,
    },
  ];

  return newSeries;
}
