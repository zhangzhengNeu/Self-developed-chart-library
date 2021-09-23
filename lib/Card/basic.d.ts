import { Params } from './interface';
import { Selected } from './index';
declare const CardBasic: ({ data, datasetParams, selected, clickEvent, }: {
    data: any[][];
    datasetParams: Params;
    selected: Selected;
    setSelected: Function;
    clickEvent: Function;
}) => JSX.Element;
export default CardBasic;
