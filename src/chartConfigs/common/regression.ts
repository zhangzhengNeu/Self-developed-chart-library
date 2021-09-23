import ecStat from 'echarts-stat';
import { SpecificChartConfig } from '../../types';

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler(options, datasetParams = {}) {
    const { series, dataset } = options;

    if (!series.length) {
      return;
    }

    // regressionFormula 显示多项式公式
    // regressionOrder 多项式的阶数
    const { regressionFormula = false, regressionOrder = 2 } = datasetParams;

    // 列数据
    const nameList = dataset.source[0].slice(1);

    // 多项式数据
    const data: [number, number][] = [];

    // 计算平均值
    for (let i = 1; i < dataset.source[0].length; i++) {
      let value = 0;
      for (let j = 1; j < dataset.source.length; j++) {
        value = value + dataset.source[j][i];
      }
      data.push([i, value / series.length]);
    }
    const regression = ecStat.regression('polynomial', data, parseInt(regressionOrder));

    // regression.points 绘制折线图的拟合数据点
    regression.points.sort(function (a, b) {
      return a[0] - b[0];
    });
    regression.points = regression.points.map((item, i) => {
      return [nameList[i], item[1]];
    });

    const seriesData = regression.points.map((item) => +item[1].toFixed(2));

    // series 加工
    const regressionSeries: any = {
      type: 'line',
      showSymbol: false,
      smooth: true,
      color: 'rgb(140, 140, 140)',
      lineStyle: {
        type: 'dashed',
      },
      markPoint: {
        // 不响应点击
        silent: true,
        itemStyle: {
          normal: {
            color: 'transparent',
          },
        },
        label: {
          normal: {
            show: regressionFormula,
            position: 'left',
            formatter: regression.expression,
            textStyle: {
              color: 'rgb(140, 140, 140)',
              fontSize: 14,
            },
          },
        },
        data: [
          {
            coord: regression.points[regression.points.length - 1],
          },
        ],
      },
    };

    // 多项式曲线数据
    dataset.source.push(['趋势线', ...seriesData]);
    series.push(regressionSeries);
    // chartOptions 添加公式
  },
};

export default config;
