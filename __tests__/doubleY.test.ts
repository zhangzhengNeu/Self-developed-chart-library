import rocketChart from '../src';
import data from '../__mocks__/data';

describe('doubleY', () => {
  const dom = document.createElement('div');
  const chart = rocketChart.init({ dom, type: 'doubleY-basic', title: 'test', data });

  afterEach(() => {
    const option = chart.getOption();
    if (Array.isArray(option.yAxis)) {
      expect(option.yAxis.length).toBe(2);
    }
  });

  it('doubleY-basic', () => {
    chart.setOption({ type: 'doubleY-basic' });
  });

  it('doubleY-bar', () => {
    chart.setOption({ type: 'doubleY-bar' });
  });

  it('doubleY-area', () => {
    chart.setOption({ type: 'doubleY-area' });
  });

  it('line-autoSum&doubleY-basic', () => {
    chart.setOption({ type: 'line-autoSum&doubleY-basic' });
  });
});
