import rocketChart from '../src';
import data from '../__mocks__/data';

describe('chart', () => {
  const dom = document.createElement('div');
  const chart = rocketChart.init({ dom, type: 'line-basic', title: 'test' });
  let markLineObj = {
    type: 'average',
    name: '平均值',
  };

  afterEach(() => {
    const { series, dataset, legend } = chart.getOption() as any;

    if (series) {
      const dataSeries = series.filter((item: any) => item.name);
      const dataSeriesLength = dataSeries.length;
      // user's markline
      series[0] && expect(series[0].markLine.data[0]).toMatchObject(markLineObj);

      if (dataSeriesLength) {
        // series length === dataset length
        expect(dataSeriesLength).toBe(dataset[0].source.length - 1);
        // series length === legend length
        expect(dataSeriesLength).toBe(legend[0].data.length);
        // series.name === legend.name
        dataSeries.forEach((item: any, i: number) => {
          expect(item.name).toBe(legend[0].data[i].name);
        });
      }
    }
  });

  it('setOption', () => {
    chart.setOption({
      option: {
        series: [
          {
            markLine: {
              data: [{ type: 'average', name: '平均值' }],
            },
            type: 'line',
          },
        ],
      },
    });
  });

  it('setOption', () => {
    markLineObj = {
      type: 'max',
      name: '最大值',
    };
    chart.setOption({
      option: {
        series: [
          {
            markLine: {
              data: [markLineObj],
            },
            type: 'line',
          },
        ],
      },
    });
  });

  it('updateData ', () => {
    const option1 = chart.getOption() as any;
    chart.updateData(data);
    const option = chart.getOption() as any;
    expect(option.dataset[0].source.length !== 0).not.toBe(0);
  });

  it('dataTransfer', () => {
    const option = chart.getOption() as any;
    expect(option.series.length).toBe(data.target.length - 1);
  });

  it('updateData empty', () => {
    chart.updateData({
      target: [],
      source: [],
    });
    const option = chart.getOption() as any;
    expect(option.dataset[0].source.length).toBe(0);
  });

  it('updateData ', () => {
    chart.updateData(data);
    const option = chart.getOption() as any;
    expect(option.dataset.length !== 0).toBe(true);
  });

  it('title', () => {
    const el = dom.getElementsByClassName('rocketChart-title')[0];
    expect(el.firstChild).not.toBeNull();
    chart.setOption({ title: null });
    expect(el.firstChild).toBeNull();
  });

  it('clear', () => {
    chart.clear();
    const { dataset, series = [] } = chart.getOption();
    expect(series.length).toBe(0);
    expect(dataset).toBe(undefined);
  });

  it('dispose ', () => {
    chart.dispose();
    expect(chart.isDisposed()).toBe(true);
  });
});
