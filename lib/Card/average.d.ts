import { Params } from './interface';
import { Selected } from './index';
declare const CardAverage: ({ data, datasetParams, selected, clickEvent, }: {
    data: any[][];
    datasetParams: Params;
    selected: Selected;
    clickEvent: Function;
}) => JSX.Element;
export default CardAverage;
