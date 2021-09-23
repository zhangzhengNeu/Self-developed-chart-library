import { ChartOptions, Data } from '../../types';
export interface FunnelColumnProps {
  data: Data;
  colors: string[];
  hideSymbol: boolean;
  formatter: Function;
  chartOptions: ChartOptions;
  option: any;
  datasetParams: any;
}

export interface FunnelItemProps {
  color: string;
  hideSymbol: boolean;
  name: string;
  value: number;
  maxValue: number;
  lastValue: number | undefined;
  step: number;
  renderItemInfo: Function;
  formatter: Function;
  mode: string;
  tipsDom: any;
  length: number;
  showTotalConversion: boolean;
  firstValue: number;
}
