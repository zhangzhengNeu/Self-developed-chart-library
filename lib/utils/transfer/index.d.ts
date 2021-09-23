/// <reference types="lodash" />
declare const toDataset: (data: import("../../types").Data) => import("../../types").Data | {
    source: any[] | {
        [key: string]: any;
    };
};
declare const toDataTable: ((data: import("../../types").Data) => any[]) & import("lodash").MemoizedFunction;
declare const validator: ((data: import("../../types").Data) => boolean) & import("lodash").MemoizedFunction;
export { toDataset, toDataTable, validator };
