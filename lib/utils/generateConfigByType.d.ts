import { ChartProps, DatasetParams } from '../types';
declare const generateConfigByType: (type: string) => {
    defaultChartProps: Partial<ChartProps>;
    datasetHandler: (dataset: any, datasetParams?: DatasetParams) => any;
};
export default generateConfigByType;
