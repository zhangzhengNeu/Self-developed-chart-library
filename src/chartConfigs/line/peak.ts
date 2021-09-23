import { differenceWith, isEqual, merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';
import { getConfig } from '../../global/label';

const defaultParams = {
  maxGap: 10,
  maxLineNum: 1,
};

const minGapFunc = (targetArray: any[], maxGap: number) => {
  return targetArray
    .map((item, i) => {
      if (i > 0) {
        return item[0] - targetArray[i - 1][0];
      }
      return maxGap;
    })
    .sort((a, b) => {
      return a - b;
    })[0];
};

const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler(options, datasetParams) {
    const { dataset, series } = options;
    const { source } = dataset;
    const { maxGap, maxLineNum, $renderLabel = {} } = { ...defaultParams, ...datasetParams };
    const lineLabelObj: any = {};
    const lineArr = source.slice(1, maxLineNum + 1).map((item: any[]) => {
      return item.slice(1);
    });
    const {
      formatter: { series: valueFormat },
    } = getConfig($renderLabel);

    lineArr.forEach((targetLine: any[], targetIndex: number) => {
      // 1. 标记所有峰和谷
      let peak_on: any[] = []; // 峰
      let peak_off: any[] = []; // 谷
      const peak = []; // 峰+谷

      for (let i = 1; i < targetLine.length - 1; i++) {
        if (targetLine[i] > targetLine[i - 1] && targetLine[i] > targetLine[i + 1]) {
          peak_on.push([i, targetLine[i], 'on_peak']);
          peak.push([i, targetLine[i], 'on_peak']);
        }
        if (targetLine[i] < targetLine[i - 1] && targetLine[i] < targetLine[i + 1]) {
          peak_off.push([i, targetLine[i], 'off_peak']);
          peak.push([i, targetLine[i], 'off_peak']);
        }
      }

      let peakOnMinGap = minGapFunc(peak_on, maxGap);
      let peakOffMinGap = minGapFunc(peak_off, maxGap);
      let _merge = [];
      let _afterMerge = peak;

      // 2. 若相邻两个峰或谷的距离小于 maxGap，则取两者中的极值，直至所有相邻的峰或谷距离都大于 maxGap
      while (peakOnMinGap < maxGap) {
        _merge = [];
        for (let i = 0; i <= peak_on.length - 2; i++) {
          if (peak_on[i + 1][0] - peak_on[i][0] < maxGap) {
            _merge.push(peak_on[i + 1][1] > peak_on[i][1] ? peak_on[i] : peak_on[i + 1]);
          }
        }
        _afterMerge = differenceWith(_afterMerge, _merge, isEqual);
        peak_on = differenceWith(peak_on, _merge, isEqual);
        peakOnMinGap = minGapFunc(peak_on, maxGap);
      }

      while (peakOffMinGap < maxGap) {
        _merge = [];
        for (let i = 0; i <= peak_off.length - 2; i++) {
          if (peak_off[i + 1][0] - peak_off[i][0] < maxGap) {
            _merge.push(peak_off[i + 1][1] > peak_off[i][1] ? peak_off[i + 1] : peak_off[i]);
          }
        }
        _afterMerge = differenceWith(_afterMerge, _merge, isEqual);
        peak_off = differenceWith(peak_off, _merge, isEqual);
        peakOffMinGap = minGapFunc(peak_off, maxGap);
      }

      // 3. 去除类型冲突的项，如连续两个峰
      const _uniq = [];
      if (_afterMerge.length) {
        let _tmp = [_afterMerge[0]];
        let currentTag = _afterMerge[0][2];
        for (let i = 1; i < _afterMerge.length; i++) {
          if (_afterMerge[i][2] === currentTag) {
            _tmp.push(_afterMerge[i]);
          } else {
            _uniq.push(_tmp);
            _tmp = [_afterMerge[i]];
            currentTag = _afterMerge[i][2];
          }
        }
        _uniq.push(_tmp);
      }

      let _afterUniq: any[] = [];
      for (let i = 0; i < _uniq.length; i++) {
        if (_uniq[i].length > 1) {
          const type = _uniq[i][0][2];
          if (type === 'on_peak') {
            const max = _uniq[i].sort((a, b) => {
              return b[1] - a[1];
            })[0];
            _afterUniq.push(max);
          }
          if (type === 'off_peak') {
            const min = _uniq[i].sort((a, b) => {
              return a[1] - b[1];
            })[0];
            _afterUniq.push(min);
          }
        } else {
          _afterUniq.push(_uniq[i][0]);
        }
      }

      // 4. 过滤：当前的峰比下一个谷还要低
      // 4. 过滤：当前的谷比下一个峰还要高
      const filterArr: any[] = [];
      _afterUniq.forEach((item, i) => {
        const type = item[2];
        if (type === 'on_peak' && i < _afterUniq.length - 1) {
          if (item[1] < _afterUniq[i + 1][1]) {
            filterArr.push(item, _afterUniq[i + 1]);
          }
        }
        if (type === 'off_peak' && i < _afterUniq.length - 1) {
          if (item[1] > _afterUniq[i + 1][1]) {
            filterArr.push(item, _afterUniq[i + 1]);
          }
        }
      });

      _afterUniq = differenceWith(_afterUniq, filterArr, isEqual);

      const allPeakOn = _afterUniq
        .filter((item) => {
          return item[2] === 'on_peak';
        })
        .map((item) => {
          return item[0];
        });

      lineLabelObj[`line${targetIndex}_on`] = targetLine.map((item: any, index: number) => {
        return allPeakOn.indexOf(index) >= 0 ? 1 : 0;
      });

      const allPeakOff = _afterUniq
        .filter((item) => {
          return item[2] === 'off_peak';
        })
        .map((item) => {
          return item[0];
        });

      lineLabelObj[`line${targetIndex}_off`] = targetLine.map((item: any, index: number) => {
        return allPeakOff.indexOf(index) >= 0 ? 1 : 0;
      });
    });

    series.forEach((item, i) => {
      merge(item, {
        showAllSymbol: true,
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            let result = '';
            const val = valueFormat ? valueFormat(params.value[i + 1]) : params.value[i + 1];
            if (i < maxLineNum && lineLabelObj[`line${i}_on`][params.dataIndex]) {
              result = val + '\r\n\r\n';
            }
            if (i < maxLineNum && lineLabelObj[`line${i}_off`][params.dataIndex]) {
              result = '\r\n\r\n' + val;
            }
            return result;
          },
          color: 'auto',
        },
      });
    });
  },
};

export default config;
