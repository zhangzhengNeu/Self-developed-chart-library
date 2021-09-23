import React, { useState, useMemo } from 'react';
import {
  buildDrillTree,
  buildRecordMatrix,
  convertDrillTreeToCrossTree,
  CrossTableIndicator,
  CrossTable,
  DrillNode,
  RecordMatrix,
} from 'ali-react-table/pivot';
import { merge } from 'lodash-es';
import { createAggregateFunction } from 'dvt-aggregation';
import { RocketCrossTable, Statistics } from '../type';
import EllipsisCell from '../EllipsisCell';
import { getPropsByType } from '../utils';
import { getFormatter } from '../../utils/valueFormat';

const defaultStatistics = {
  show: false,
  position: 'start',
  text: ['总计', '小计'],
};

const Table: React.FC<{
  tableProps: RocketCrossTable;
  container: HTMLDivElement;
  theme: any;
  device: any;
}> = ({ tableProps, container, theme = 'default', device }) => {
  const { dataSource = [], datasetParams = {}, ...restProps } = tableProps;

  const {
    leftCodes = [],
    topCodes = [],
    indicatorSide = 'top',
    supportsExpand = false,
    ellipsis = false,
    setCellProps,
    size,
    columns = {},
    percent,
  } = datasetParams;

  const statistics = merge({}, defaultStatistics, datasetParams.statistics);
  const leftStatistics = merge({}, statistics, datasetParams.leftStatistics);
  const topStatistics = merge({}, statistics, datasetParams.topStatistics);

  const { style, defaultColumnWidth } = getPropsByType(theme, size, device);

  const indicators = datasetParams.indicators
    ? datasetParams.indicators.map((item) => {
        const { code } = item;
        const name = item.name || code;
        const expression = item.expression || `SUM(${code})`;
        return {
          //单个指标下无 indicators 参数，对齐无效。。
          align: columns[name]?.align,
          expression,
          ...item,
          name,
        } as CrossTableIndicator;
      })
    : [];

  //多指标情况为透视 单指标为交叉
  const multipleIndicators = indicators.length > 1;

  const [leftExpandKeys, setLeftExpandKeys] = useState<string[]>([]);
  const [topExpandKeys, setTopExpandKeys] = useState<string[]>([]);

  const leftDrillTree = buildDrillTree(dataSource, leftCodes, {
    includeTopWrapper: true,
  });

  const [leftTreeRoot] = convertDrillTreeToCrossTree(leftDrillTree, {
    indicators: multipleIndicators && indicatorSide === 'left' ? indicators : undefined,
    generateSubtotalNode: makeGenerateSubtotalNode(leftStatistics),
    supportsExpand,
    expandKeys: leftExpandKeys,
    onChangeExpandKeys: setLeftExpandKeys,
  });

  const topDrillTree = buildDrillTree(dataSource, topCodes, {
    includeTopWrapper: true,
  });
  const [topTreeRoot] = convertDrillTreeToCrossTree(topDrillTree, {
    indicators: multipleIndicators && indicatorSide === 'top' ? indicators : undefined,
    generateSubtotalNode: makeGenerateSubtotalNode(topStatistics),
    supportsExpand,
    expandKeys: topExpandKeys,
    onChangeExpandKeys: setTopExpandKeys,
  });

  const aggregate = createAggregateFunction(indicators);
  const matrix = buildRecordMatrix({ data: dataSource, leftCodes, topCodes, aggregate });

  const cellNumber = getCellNumber(matrix);

  // 描述左侧维度列名，不传则显示空白
  const leftMetaColumns = leftCodes.map((item) => ({ name: item }));

  return (
    <>
      <CrossTable
        defaultColumnWidth={defaultColumnWidth}
        style={{
          ...style,
          '--header-cell-border': `1px solid var(--border-color)}`,
          '--cell-border-vertical': `1px solid var(--border-color)}`,
          height: container.offsetHeight - parseInt(style['--table-font-size']),
        }}
        // TODO scale verticalScroll
        useVirtual={{
          vertical: cellNumber > 4000 ? true : false,
          horizontal: 'auto',
          header: 'auto',
        }}
        leftTree={leftTreeRoot.children || []}
        leftTotalNode={leftTreeRoot} // 当 leftTree 为空时，leftTotalNode 用于渲染总计行
        leftMetaColumns={leftMetaColumns}
        topTree={topTreeRoot.children || []}
        topTotalNode={topTreeRoot} // 当 topTree 为空时，topTotalNode 用于渲染总计列
        render={(value, leftNode, topNode) => {
          const indicator = multipleIndicators
            ? leftNode.data?.indicator ?? topNode.data?.indicator
            : indicators[0];

          let formatterType = indicator && columns[indicator.code]?.formatter;
          // 当且仅当用户未设置格式化并设置百分比时，formatter采用 percent
          if (!formatterType && percent && ['area-down'].includes(percent)) {
            formatterType = 'percent';
          }

          const formatedValue = indicator ? getFormatter(formatterType)(value) : value;

          return ellipsis ? <EllipsisCell value={formatedValue} /> : formatedValue;
        }}
        getCellProps={(value, leftNode, topNode) => {
          const record = matrix.get(leftNode.data.dataKey)?.get(topNode.data.dataKey);
          const code = multipleIndicators ? topNode.code : indicators[0]?.code;
          return setCellProps ? setCellProps(value, code, record) : {};
        }}
        getValue={(leftNode, topNode) => {
          const leftDataKey = leftNode.data.dataKey;
          const topDataKey = topNode.data.dataKey;
          const record = matrix.get(leftDataKey)?.get(topDataKey);
          const indicator = multipleIndicators
            ? leftNode.data?.indicator ?? topNode.data?.indicator
            : indicators[0];
          const code = indicator?.code;

          if (record == null || !indicator) {
            return '-';
          }
          let value = record[code];

          switch (percent) {
            case 'area-down':
              const sumRecord = getSumRecord(leftNode, topNode, matrix);
              value = sumRecord ? value / sumRecord[code] : value;
              break;
          }

          return value;
        }}
      />
    </>
  );
};

export default Table;

function makeGenerateSubtotalNode(statistics: Statistics) {
  if (!statistics.show) {
    return undefined;
  }
  const [main, sub] = statistics.text!;
  return (drillNode: DrillNode) => ({
    position: statistics.position,
    value: drillNode.path.length === 0 ? main : sub || main,
  });
}

function getCellNumber(matrix: any) {
  if (!matrix) {
    return 0;
  }
  const list = matrix.values();

  return matrix.size * list.next().value.size;
}

function getSumRecord(leftNode: any, topNode: any, matrix: RecordMatrix) {
  const { dataKey, dataPath } = leftNode?.data;
  const topDataKey = topNode?.data?.dataKey;
  let totalDataKey = dataKey;
  // dataPath.length>1 非总计
  if (dataPath.length > 1) {
    totalDataKey = totalDataKey.replace(dataPath[dataPath.length - 1], '').trim();
  }

  return matrix.get(totalDataKey)?.get(topDataKey);
}
