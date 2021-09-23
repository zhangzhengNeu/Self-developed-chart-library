import rocketChart from '../lib';
import data from '../__mocks__/data';

describe('line type', () => {
  const dom = document.createElement('div');
  const chart = rocketChart.init({ dom, type: 'line-basic', data });

  it('type line-basic', () => {
    expect(chart.isDisposed()).toBe(false);
  });

  it('type line-smooth', () => {
    chart.setOption({ type: 'line-smooth' });
    chart.getOption().series.forEach(item => {
      expect(item.smooth).toBe(true);
    });
    chart.setOption({ type: 'line-basic' });
    chart.getOption().series.forEach(item => {
      expect(item.smooth).not.toBe(true);
    });
  });

  it('type line-hideSymbol', () => {
    chart.setOption({ type: 'line-hideSymbol' });
    chart.getOption().series.forEach(item => {
      expect(item).toMatchObject({
        showSymbol: false,
        label: {
          show: false,
        },
      });
    });
  });

  it('type line-label', () => {
    chart.setOption({ type: 'line-label' });
    chart.getOption().series.forEach(item => {
      expect(item).toMatchObject({
        showAllSymbol: true,
        label: {
          show: true,
        },
      });
    });
    chart.setOption({ datasetParams: { showLabel: false } });
    chart.getOption().series.forEach(item => {
      expect(item).toMatchObject({
        showSymbol: true,
        label: {
          show: false,
        },
      });
    });
  });

  it('type line-autoSum', () => {
    chart.setOption({ type: 'line-autoSum' });
    expect(chart.getOption().series.length).toBe(data.target.length);
  });

  it('type line-autoOther', () => {
    chart.setOption({ type: 'line-autoOther', datasetParams: { mergeStart: 1 } });
    expect(chart.getOption().series.length).toBe(1);
  });
});

describe('line multiple types', () => {
  it('line-hideSymbol&line-label', () => {
    const chart = rocketChart.init({
      dom: document.createElement('div'),
      type: 'line-hideSymbol&line-label',
      data,
      datasetParams: { showAllSymbol: true },
    });
    chart.getOption().series.forEach(item => {
      expect(!!item.showSymbol).toBe(false);
      expect(item.label).toMatchObject({
        show: false,
      });
    });
  });
});
