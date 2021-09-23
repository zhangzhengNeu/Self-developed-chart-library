import rocketChart from '../lib';
import data from '../__mocks__/data';

describe('table', () => {
  const dom = document.createElement('div');
  const chart = rocketChart.init({ dom, type: 'table', data });
  const thead = dom.querySelector('.ant-table-thead');

  it('check render', () => {
    const thLength = thead!.querySelectorAll('th').length;
    const dataLength = data.source.length;
    expect(thLength).toEqual(dataLength);
  });
});
