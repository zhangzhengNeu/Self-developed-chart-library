import { merge } from 'lodash-es';
import { ChartOptions } from '../types';

export default function checkSymbolCount(option: ChartOptions, maxSymbolCount = 400) {
  const { dataset, series } = option as any;
  if (!dataset || !series) {
    return;
  }
  if (!dataset.source || !dataset.source[0]) {
    return;
  }
  const count = (dataset.source.length - 1) * (dataset.source[0].length - 1);
  if (count >= maxSymbolCount) {
    series.forEach((item: any) => {
      item.showSymbol = false;
    });
    merge(option, { tooltip: { trigger: 'axis' } });
    console.log(`当前symbol数量：${count} 超过最大限制：${maxSymbolCount}`);
  }
}
