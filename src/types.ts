import { ReactElement } from 'react';
import Vue from 'vue';
import { BaseTableProps } from 'ali-react-table';
import { EChartOption } from 'echarts';

export interface ChartOptions extends EChartOption {
  customerColor?: { [key: string]: string };
  table?: Partial<BaseTableProps>;
  indicator?: {
    title: string | HTMLElement | ReactElement;
    titleRight?: string | HTMLElement | ReactElement;
    cont: number | string | HTMLElement | ReactElement;
    unit?: string;
    footer?: string | HTMLElement | ReactElement;
  };
}

export type ComponentType = 'title' | 'customComponent' | 'footer';
export type Data = {
  target: { name: string; key: string }[];
  source: any[] | { [key: string]: any };
  links: any;
  categoryKey: any;
  type: any;
};
export type CustomComponent = ReactElement | Vue | HTMLElement | string | null;
export type DatasetParams = { [key: string]: any };
export type OptionHandler = (
  option: { [key: string]: any; dataset: any; series: EChartOption.Series[] },
  datasetParams?: DatasetParams,
  props?: Record<string, any>,
) => void;
export type Formatters = {
  [key: string]: (value: any) => any;
};

export interface ChartProps {
  [key: string]: any;
  dom: HTMLDivElement;
  type: string;
  data?: Data;
  formatters?: Formatters;
  option?: ChartOptions;
  theme?: object | string;
  device?: 'desktop' | 'mobile';
  opts?: {
    devicePixelRatio?: number;
    renderer?: string;
    width?: number | string;
    height?: number | string;
  };
  datasetParams?: DatasetParams;
  maxSymbolCount?: number;
  title?: CustomComponent;
  customComponent?: CustomComponent;
  footer?: CustomComponent;
  toolBar?: CustomComponent;
  subTitle?: CustomComponent;
}

export interface SetOption {
  option?: ChartOptions;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  type?: string;
  data?: Data;
  datasetParams?: DatasetParams;
  title?: CustomComponent;
  customComponent?: CustomComponent;
  footer?: CustomComponent;
  toolBar?: CustomComponent;
  subTitle?: CustomComponent;
}

export interface SpecificChartConfig {
  defaultChartProps: Partial<ChartProps>;
  optionHandler?: OptionHandler;
  onResize?: any;
}
