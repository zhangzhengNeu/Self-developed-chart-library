interface LegendConfig {
    legend?: {
        top?: string | number;
        right?: string | number;
        left?: string | number;
        orient?: string;
    };
    grid?: {
        top?: string | number;
        right?: string | number;
        left?: string | number;
        bottom?: string | number;
    };
}
interface LegendParam {
    placement?: string;
    width?: string | number;
}
declare const generateLegendConfig: (chartOptions: any, { placement, width }?: LegendParam) => LegendConfig;
export default generateLegendConfig;
