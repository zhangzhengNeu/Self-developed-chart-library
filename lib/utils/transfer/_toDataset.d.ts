import { Data } from '../../types';
declare const _toDataset: (data: Data) => Data | {
    source: any[] | {
        [key: string]: any;
    };
};
export default _toDataset;
