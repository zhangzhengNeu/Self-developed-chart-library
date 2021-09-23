import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {
    option: {
      xAxis: {
        show: false, //!important ...
      },
      yAxis: {
        show: false, //!important ...
      },
      tooltip: { trigger: 'item' },
    },
  },
  optionHandler(options, datasetParams = {}) {
    const { dataset } = options;
    const { repulsion = 500, edgeLength = 180 } = datasetParams;

    console.log('dataset', dataset);
    console.log('options', options);

    const { target, categoryKey, source, links } = dataset;

    let nameOfCategoryKey = '';
    target?.forEach((item: any) => {
      if (item.key == categoryKey) {
        nameOfCategoryKey = item.name;
      }
    });
    let dataOfCategory: any = [];
    source.forEach((item: any) => {
      if (item[0] == nameOfCategoryKey) {
        dataOfCategory = item.slice(1);
      }
    });
    let dataOfSymbolSize: any = [];
    source.forEach((item: any) => {
      if (item[0] == '圆点尺寸') {
        dataOfSymbolSize = item.slice(1);
      }
    });
    let dataOfX: any = [];
    source.forEach((item: any) => {
      if (item[0] == 'x') {
        dataOfX = item.slice(1);
      }
    });
    let dataOfY: any = [];
    source.forEach((item: any) => {
      if (item[0] == 'y') {
        dataOfY = item.slice(1);
      }
    });

    const nodeArr: any = [];
    for (let i: any = 0; i < source[0].slice(1).length; i++) {
      nodeArr.push({});
    }
    nodeArr.forEach((item: any, i: number) => {
      item.id = source[0]?.slice(1)[i];
      item.value = source[1]?.slice(1)[i];
      item.category = dataOfCategory[i];
      item.symbolSize = dataOfSymbolSize[i];
      item.x = dataOfX[i];
      item.y = dataOfY[i];
    });
    console.log('nodeArr', nodeArr);

    const categoryNameArr = dataOfCategory?.filter((item: any, index: number) => {
      //给分类字段去重 遍历出数组中数字第一次出现的下标,与数字所在数组的下标相比较，
      //为true就是第一次出现
      return dataOfCategory.indexOf(item) === index;
    });
    const nameArr: any = [];
    categoryNameArr.forEach((item: any) => {
      nameArr.push({ name: item });
    });
    //nameArr是echart的categories要求的格式

    nodeArr.map((item: any) => {
      item.prevCategory = item.category;
      item.category = categoryNameArr.indexOf(item.category);
      //category需要为数字下标的形式
      return item;
    });

    const valArray: any = [];
    nodeArr.forEach((item: any) => {
      valArray.push(item.value);
    });
    const maxValue = Math.max(...valArray);
    nodeArr.map((item: any, i: number) => {
      merge(item, {
        prevsymbolSize: item.symbolSize,
        symbolSize: item.symbolSize
          ? item.symbolSize
          : item.value * (40 / maxValue > 1 ? 1 : 40 / maxValue),
      });
    });
    const series = [];
    series.push({
      type: 'graph',
      layout: 'force',
      data: categoryKey
        ? nodeArr
        : nodeArr.map((item: any) => {
            item.category = 0;
            return item;
          }), //不写categoryKey时的处理
      links: links,
      categories: categoryKey ? nameArr : [{ name: undefined }], //不写categoryKey时的处理
      roam: true,
      draggable: true,
      lineStyle: {
        color: 'source',
        curveness: 0,
        width: 1,
      },
      force: {
        repulsion: repulsion,
        edgeLength: edgeLength,
      },
      labelLayout: {
        hideOverlap: true,
      },
      focusNodeAdjacency: true,
      emphasis: {
        focus: 'adjacency',
        label: {
          position: 'right',
          formatter: '{b}',
        },
        lineStyle: {
          width: 5,
        },
      },
    });
    options.series = series;
  },
};

export default config;
