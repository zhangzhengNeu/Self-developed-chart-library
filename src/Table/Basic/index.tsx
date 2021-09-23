import React, { useState, useEffect, useCallback } from 'react';
import { BaseTable, BaseTableProps, ArtColumn, SortItem } from 'ali-react-table';
import {
  applyTransforms,
  makeSortTransform,
  collectNodes,
  makeColumnResizeTransform,
} from 'ali-react-table';
import { cloneDeep, isFunction, debounce } from 'lodash-es';
import ChartPagination from './ChartPagination';
import Summary from './Summary';
import EllipsisCell from '../EllipsisCell';
import { RocketBasicTable } from '../type';
import { getPropsByType } from '../utils';
import { getFormatter } from '../../utils/valueFormat';

const defaultPageSizeOptions = [10, 30, 50];
const cellPadding = 6;

const fixCursor = debounce(
  () => {
    const $html = document.querySelector('html');
    if ($html) {
      $html.style.cursor = 'inherit';
    }
  },
  500,
  { leading: false },
);

const BasicTable = ({
  tableProps,
  container,
  device,
  theme = 'default',
}: {
  tableProps: RocketBasicTable;
  container: HTMLDivElement;
  theme: any;
  device: any;
}) => {
  const { dataSource = [], columns = [], datasetParams = {}, ...restProps } = tableProps;
  const {
    onChange,
    sorts,
    pagination = {},
    scrollX = false,
    ellipsis = false,
    lockList,
    summary,
    keepDataSource = false,
    renderCell,
    setCellProps,
    size,
    drag,
    colSizes,
    onColSizesChange,
  } = datasetParams;

  const {
    current,
    defaultCurrent = 1,
    defaultPageSize = defaultPageSizeOptions[1],
    pageSize,
    pageSizeOptions,
    show: showPagination = true,
  } = pagination;

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  const pageHeight = device === 'desktop' ? 34 : 28;

  const isLocked = !!(Array.isArray(lockList) && lockList.length);
  const isSummary = !!(Array.isArray(summary) && summary.length);

  const { style, defaultColumnWidth } = getPropsByType(theme, size, device);
  const summaryHeight = parseInt(style['--header-row-height']);

  const averageWidth = containerWidth / columns.length;
  const columnWidth = Math.max(averageWidth, defaultColumnWidth);

  const [tableRef, setTableRef] = useState<any>();
  const [summaryRef, setSummaryRef] = useState<HTMLElement>();

  const [page, setPage] = useState({
    current: defaultCurrent,
    size: defaultPageSize,
    sizeOptions: defaultPageSizeOptions,
  });
  const [renderData, setRenderData] = useState<BaseTableProps>({ dataSource: [], columns: [] });
  const [selfSorts, setSelfSorts] = useState<SortItem[]>([]);
  const [pagedData, setPagedData] = useState<BaseTableProps['dataSource']>([]);
  const [dragSizes, setDragSizes] = useState<number[]>([]);

  let bottomHeight = 0;
  showPagination && (bottomHeight += pageHeight);
  isSummary && (bottomHeight += summaryHeight);

  const getSummaryRef = useCallback((node) => node && setSummaryRef(node), []);
  const getTableRef = useCallback((node) => node && setTableRef(node), []);

  const onChangeHandler = useCallback(
    (newProps: any, trigger = '') => {
      if (isFunction(onChange)) {
        const state = cloneDeep({ page, sorts: selfSorts, ...newProps });
        onChange(state, trigger);
      }
    },
    [onChange, page, selfSorts],
  );

  const pageChange = (index?: number, size?: number) => {
    if (!showPagination) {
      return;
    }
    const newSize = pageSize || size || page.size;
    const newCurrent = current || index || page.current;
    const maxCurrent = Math.ceil(dataSource.length / newSize);
    setPage({ ...page, current: Math.min(newCurrent, maxCurrent), size: newSize });

    onChangeHandler(
      {
        page: {
          ...page,
          current: index,
          size: size,
        },
      },
      'pagination',
    );
  };

  const sortsChange = useCallback(
    (newSort: SortItem[]) => {
      if (!sorts) {
        setSelfSorts(newSort);
      }
      onChangeHandler({ sorts: newSort }, 'sorts');
    },
    [onChangeHandler, sorts],
  );

  useEffect(() => {
    if (drag && colSizes && colSizes.length) {
      setDragSizes(colSizes.map((item) => item * containerWidth));
      return;
    }
    const defaultSizes = collectNodes(columns, 'leaf-only').map(
      (col: ArtColumn) => col.width ?? columnWidth,
    );
    setDragSizes(defaultSizes);
  }, [averageWidth, columnWidth, columns, colSizes, containerWidth]);

  // 分页变化
  useEffect(() => {
    const options = pageSizeOptions || defaultPageSizeOptions;
    setPage({
      current: current || defaultCurrent,
      size: pageSize && options.includes(pageSize) ? pageSize : defaultPageSize,
      sizeOptions: options,
    });
  }, [current, defaultCurrent, defaultPageSize, pageSize, pageSizeOptions]);

  // 排序
  useEffect(() => {
    setSelfSorts(sorts || []);
  }, [sorts]);

  // 计算分页数据
  useEffect(() => {
    if (!showPagination) {
      setPagedData(dataSource);
      return;
    }
    let data = dataSource;
    const length = pageSize || page.size;
    const start = ((current || page.current) - 1) * length;
    const end = start + length;
    data = dataSource.slice(start, end);
    setPagedData(data);
  }, [current, dataSource, page, pageSize, showPagination]);

  // 滚动
  useEffect(() => {
    if (!tableRef) {
      return;
    }
    if (!summaryRef) {
      return;
    }
    const tableDom = tableRef.doms.mainBody as HTMLElement;
    const summaryDom = summaryRef;
    const updateScrollLeft = (e: any) => {
      summaryDom.style.left = `${-e.target.scrollLeft}px`;
    };

    tableDom.addEventListener('scroll', updateScrollLeft);
    return () => {
      tableDom.removeEventListener('scroll', updateScrollLeft);
    };
  }, [tableRef, summaryRef]);

  // 计算渲染数据
  useEffect(() => {
    const enhancers = [
      makeSortTransform({
        sorts: selfSorts,
        onChangeSorts: sortsChange,
        mode: 'single', // multiple,
        keepDataSource,
      }),
    ];
    if (drag) {
      enhancers.push(
        makeColumnResizeTransform({
          sizes: dragSizes,
          onChangeSizes: (sizes) => {
            setDragSizes(sizes);
            const percent = sizes.map((item) => +(item / containerWidth).toFixed(3));
            onColSizesChange && onColSizesChange(percent);
            // fix bug 手动移除html上的cursor。。。
            fixCursor();
          },
          disableUserSelectWhenResizing: true,
          appendExpander: true,
          minSize: 80,
        }),
      );
    }
    const data = applyTransforms(
      {
        columns: columns,
        dataSource: pagedData,
      },
      ...enhancers,
    );

    const render = (col: ArtColumn, value: any, record: any, rowIndex: number) => {
      const formatedValue = getFormatter(col.formatter)(value);
      const result = isFunction(renderCell)
        ? renderCell(formatedValue, record, rowIndex)
        : formatedValue;

      return ellipsis ? (
        <EllipsisCell value={formatedValue} width={(col.width || 0) - cellPadding * 2}>
          {result}
        </EllipsisCell>
      ) : (
        result
      );
    };

    data.columns.forEach((item, i) => {
      item.render = (...args) => render(item, ...args);

      if (dragSizes.length) {
        item.width = dragSizes[i];
      } else if (!drag && (scrollX || (isLocked && lockList))) {
        item.width = columnWidth;
      }

      if (lockList && lockList.includes(item.name)) {
        item.lock = true;
      }

      if (setCellProps) {
        item.getCellProps = (value, record) => {
          return setCellProps(value, item.code, record);
        };
      }
    });
    setRenderData(data);
  }, [
    columns,
    containerWidth,
    ellipsis,
    isLocked,
    keepDataSource,
    lockList,
    pagedData,
    scrollX,
    selfSorts,
    sortsChange,
    renderCell,
    setCellProps,
    dragSizes,
    drag,
    columnWidth,
    onColSizesChange,
  ]);
  console.log(dragSizes, renderData.columns);
  return (
    <>
      <BaseTable
        // TODO scale verticalScroll
        useVirtual={{
          vertical: renderData.dataSource.length >= 200,
          horizontal: 'auto',
          header: 'auto',
        }}
        ref={getTableRef}
        {...restProps}
        isStickyHead
        style={{
          ...style,
          '--header-cell-border': drag ? '1px solid var(--border-color)' : 'none',
          height: containerHeight - bottomHeight - parseInt(style['--table-font-size']),
        }}
        dataSource={renderData.dataSource}
        columns={renderData.columns}
        // stickyBottom={bottomHeight}
      />
      <div className="rocketChart-table-bottom" style={{ height: bottomHeight }}>
        <Summary
          style={{
            fontSize: style['--table-font-size'],
            backgroundColor: style['--header-bgcolor'],
            height: summaryHeight,
          }}
          ref={getSummaryRef}
          renderData={renderData}
          summary={summary}
          isSummary={isSummary}
          isLocked={isLocked}
          lockList={lockList}
          scrollX={scrollX}
          sizes={dragSizes}
        />
        <ChartPagination
          style={style}
          show={showPagination}
          page={page}
          total={dataSource.length}
          onChange={pageChange}
        />
      </div>
    </>
  );
};

export default BasicTable;
