import { BaseTableProps, SortItem, ArtColumn, CellProps, ArtColumnAlign } from 'ali-react-table';
import { CrossTableProps, CrossTableIndicator } from 'ali-react-table/pivot';

export interface CommonDatasetParams {
  ellipsis?: boolean;
  setCellProps?: (value?: any, code?: string, record?: any) => CellProps;
  size?: 'default' | 'small';
  align?: ArtColumnAlign | { [key: string]: ArtColumnAlign };
  columns?: Record<
    string,
    {
      align?: ArtColumnAlign | { [key: string]: ArtColumnAlign };
      formatter?: string;
    }
  >;
}

export interface RocketBasicTable extends Partial<BaseTableProps> {
  datasetParams?: CommonDatasetParams & {
    onChange?: (state: { i: any }, trigger: string) => void;
    scrollX?: boolean;
    sorts?: SortItem[];
    lockList?: string[];
    ingoreCols?: string[];
    pagination?: {
      show?: boolean;
      defaultCurrent?: number;
      current?: number;
      defaultPageSize?: number;
      pageSize?: number;
      pageSizeOptions?: number[];
    };
    summary?: (string | number)[];
    keepDataSource?: boolean;
    renderCell?: ArtColumn['render'];
    drag?: boolean;
    colSizes?: number[];
    onColSizesChange?: (size: number[]) => void;
  };
}

export type Statistics = {
  show?: boolean;
  position: 'start' | 'end';
  text?: [string, string?];
};
export interface RocketCrossTable extends Partial<CrossTableProps> {
  dataSource?: BaseTableProps['dataSource'];
  datasetParams?: CommonDatasetParams & {
    leftCodes?: string[];
    topCodes?: string[];
    indicators?: CrossTableIndicator[];
    indicatorSide?: 'top' | 'left';
    statistics?: Statistics;
    leftStatistics?: Statistics;
    topStatistics?: Statistics;
    supportsExpand?: boolean;
    percent?: 'area-down';
  };
}
