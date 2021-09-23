/**
 * 系列label格式化
 * @param formatter 每项的格式化函数
 */
export declare const formatDataLabel: (formatter?: Function) => (params: any) => any;
declare const _default: (chartOptions: any, datasetParams: any, data: any, isDoubleY: boolean) => {
    $tooltip?: undefined;
    config?: undefined;
} | {
    $tooltip: {
        formatter: any;
    } | {
        formatter?: undefined;
    } | undefined;
    config: {
        [x: string]: ({} | undefined)[];
    };
} | {
    $tooltip: {
        formatter: any;
    } | {
        formatter?: undefined;
    };
    config: {
        [x: string]: {};
    };
} | null;
/**
 * 双轴图不支持tooltips格式化
 */
export default _default;
