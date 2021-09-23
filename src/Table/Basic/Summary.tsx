import React from 'react';
import EllipsisCell from '../EllipsisCell';
import { getFormatter } from '../../utils/valueFormat';

const Summary: React.FC<any> = (Props, ref) => {
  const { renderData, summary, isSummary, isLocked, lockList, style, scrollX, sizes } = Props;

  const columnCount = renderData.columns.length;
  if (!isSummary || !summary || !columnCount) {
    return null;
  }

  const summaryObjs = summary.map((text: any, i: any) => {
    const { align, formatter } = renderData.columns[i];
    return {
      text: getFormatter(formatter)(text),
      size: sizes[i],
      align: align,
    };
  });

  let leftSummary: any[] = [];
  let rightSummary: any[] = [];

  if (isLocked && lockList && renderData.columns.length > 1) {
    let lockString = '';
    renderData.columns.forEach((item: any) => {
      lockString += lockList.includes(item.name) ? '1' : '0';
    });
    const list = lockString.split('0');
    const leftList = list[0];
    const rightList = list[list.length - 1];
    leftSummary = summaryObjs.slice(0, leftList.length);
    rightSummary = summaryObjs.slice(summaryObjs.length - rightList.length, summaryObjs.length);
  }

  const renderItems = (list: any[]) => {
    if (!list.length) {
      return null;
    }
    return list.map((item, i) => {
      return (
        <div
          key={i}
          className="rocketChart-table-summaryItem"
          style={{ width: item.size, textAlign: item.align }}
        >
          <EllipsisCell value={item.text} />
        </div>
      );
    });
  };

  return (
    <div className="rocketChart-table-summary" style={style}>
      <div ref={ref} className="rocketChart-table-summaryInner">
        {renderItems(summaryObjs)}
      </div>
      <div className="rocketChart-table-summaryLeft">{renderItems(leftSummary)}</div>
      <div className="rocketChart-table-summaryRight">{renderItems(rightSummary)}</div>
    </div>
  );
};

export default React.forwardRef(Summary);
