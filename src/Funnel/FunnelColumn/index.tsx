import React, { useMemo } from 'react';
import { FunnelColumnProps, FunnelItemProps } from './type';
import { renderNumeralMap } from '../../utils/index';
import { getStyle } from '../../global/tooltip';
import './style.scss';
const { percent: renderPercent } = renderNumeralMap;

const FunnelItem = (props: FunnelItemProps) => {
  const {
    hideSymbol,
    color,
    step = '-',
    name = '',
    value = 0,
    maxValue,
    lastValue,
    renderItemInfo,
    formatter,
    mode,
    tipsDom,
    showTotalConversion,
    firstValue,
  } = props;
  const valFormatted = formatter ? formatter({ data: { value } }) : value;
  // 转化率
  const basePercent = renderPercent((lastValue || value) / maxValue);
  const transPercent = lastValue ? renderPercent(value / lastValue) : '100%';
  const valueArray = [valFormatted + '', `(${transPercent})`];

  let keys = '';
  let values = '';
  const a = getStyle(mode, { color: color, name: name, value: valueArray });
  keys += a.key;
  values += a.value;

  return (
    <li className="rocket-chart-funnel-item">
      <div className="funnel-conversion">
        {step > 1 && <span className="funnel-conversion-icon">{transPercent}</span>}
      </div>
      <div className="funnel-wrapper">
        <div
          className="funnel-text"
          style={{
            visibility: hideSymbol ? 'hidden' : 'visible',
          }}
        >
          <span title={name}>{name}</span>
          <div className="funnel-text-sub">
            {renderItemInfo && renderItemInfo(name, step)}
            <span style={{ paddingLeft: 5 }}>
              {valFormatted}
              {showTotalConversion ? `(${renderPercent(value / firstValue)})` : []}
            </span>
          </div>
        </div>
        <div className="funnel-cover-wrap">
          <div className="funnel-cover" style={{ width: basePercent }}>
            <div className="cover-color" style={{ background: color, width: transPercent }} />
            <div
              className="tooltip-content"
              dangerouslySetInnerHTML={{
                __html: `
          <div >
            <div style="display:flex; margin: 5px 0;">
              <div>${keys}</div>
              <div style="display:table; margin-left: 5px">${values}</div>
            </div>
            ${tipsDom}
          </div>
      `,
              }}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

const FunnelColumn = (props: FunnelColumnProps) => {
  const { datasetParams = {} } = props;
  const { showTotalConversion = false } = datasetParams;
  const {
    data: { source = [[], []] } = {},
    colors,
    hideSymbol,
    datasetParams: { sort = 'default', $tooltip } = {},
    chartOptions,
    option = {},
  } = props;
  const { mode, tips } = $tooltip || {};
  const tipsDom = tips ? `<p style="color: #aaa; margin: 0">${tips}</p>` : '';
  const renderItemInfo = () => {};

  const sortedSource = useMemo(() => {
    // 只要sort不为none都进行排序
    if (sort === 'none') return source;

    const structSource = source[0].map((item, index) => ({ item, value: source[1][index] }));

    structSource.sort((a, b) => b.value - a.value);

    return [structSource.map(({ item }) => item), structSource.map(({ value }) => value)];
  }, [source]);

  const totalTrans = useMemo(() => {
    const firstValue = sortedSource[1][0];
    const lastValue = sortedSource[1][sortedSource[1].length - 1];
    return lastValue / firstValue;
  }, [sortedSource]);

  const maxValue = useMemo(() => Math.max(...sortedSource[1]), [sortedSource]);

  const formatter = useMemo(
    () => chartOptions?.series && chartOptions?.series[0]?.label?.formatter,
    [chartOptions],
  );

  return (
    <div className="rocket-chart-funnel" style={{ paddingTop: option?.grid?.top || 30 }}>
      <ul className="rocket-chart-ul">
        {sortedSource[0].map((name, index) => {
          const lastValue = sortedSource[1][index - 1];
          const firstValue = sortedSource[1][0];
          return (
            <FunnelItem
              firstValue={firstValue}
              showTotalConversion={showTotalConversion}
              length={length}
              tipsDom={tipsDom}
              mode={mode}
              key={name}
              hideSymbol={hideSymbol}
              color={colors[index % colors.length]} // 颜色数组循环使用
              step={index + 1}
              maxValue={maxValue}
              lastValue={lastValue}
              name={name}
              value={sortedSource[1][index]}
              renderItemInfo={renderItemInfo}
              formatter={formatter}
            />
          );
        })}
        <div className="conversion-wrapper">
          <div className="placeholder"></div>
          {source[0].length ? (
            <div className="rocket-chart-funnel-transPercent">
              总转化率：{renderPercent(totalTrans)}
            </div>
          ) : (
            <h4>暂无数据</h4>
          )}
        </div>
      </ul>
    </div>
  );
};

export default FunnelColumn;
