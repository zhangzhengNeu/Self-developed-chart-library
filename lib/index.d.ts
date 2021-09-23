import echarts, { ECharts } from 'echarts';
import { ChartProps, ChartOptions, Data, SetOption } from './types';
import './styles/index.scss';
declare class Chart {
    private disposed;
    private chartProps;
    private id;
    private chartPropsFromTypes;
    private datasetHandler;
    chartOptions: ChartOptions;
    echart: ECharts;
    constructor(chartProps: ChartProps);
    private init;
    get isDoubleY(): boolean;
    get isTable(): boolean;
    get isIndicator(): boolean;
    get isFunnelColumn(): boolean;
    get isCard(): boolean;
    get isEChart(): boolean;
    private onChangeType;
    private initEchart;
    private bindChartEvent;
    private renderComponent;
    private getChartOptionsByData;
    /**
     * 不依赖chartOpts参数计算的option
     * @param chartOptions
     * @param datasetParams
     * @param data
     */
    private getGlobalOption;
    /**
     * 依赖所有参数计算的option
     * @param chartOptions
     * @param datasetParams
     * @param data
     */
    private getLastOption;
    /**
     * 是否有数据
     */
    private hasData;
    private renderTable;
    /**
     * 绘制dom类型图表
     */
    private renderDomChart;
    private renderFunnelColumn;
    setOption: ({ option, notMerge, lazyUpdate, type, data, datasetParams, ...components }: SetOption) => Promise<void>;
    private renderChart;
    private renderNoData;
    private clearComponents;
    private setCustomerColor;
    /**
     * 加载高德地图geoJson
     */
    private loadMap;
    /**
     * 创建标注
     * position: 位置
     * text: 文字
     */
    createDataMaker: ({ position, text, point, bottom, trigger, }: {
        position?: number[] | undefined;
        text?: string | undefined;
        point?: {} | undefined;
        bottom?: boolean | undefined;
        trigger?: string | undefined;
    }) => void;
    updateData: (data?: Data) => void;
    disposeEchart: () => void;
    dispose: () => void;
    clear: () => void;
    getDataURL: () => void;
    resize: ({ width, height }?: {
        width?: string | number | undefined;
        height?: string | number | undefined;
    }) => void;
    getOption: () => {
        table: Partial<import("ali-react-table").BaseTableProps> | undefined;
        title?: echarts.EChartTitleOption | echarts.EChartTitleOption[] | undefined;
        legend?: echarts.EChartOption.Legend | undefined;
        grid?: echarts.EChartOption.Grid | echarts.EChartOption.Grid[] | undefined;
        xAxis?: echarts.EChartOption.XAxis | echarts.EChartOption.XAxis[] | undefined;
        yAxis?: echarts.EChartOption.YAxis | echarts.EChartOption.YAxis[] | undefined;
        polar?: object | undefined;
        radiusAxis?: object | undefined;
        angleAxis?: object | undefined;
        radar?: object | undefined;
        dataZoom?: echarts.EChartOption.DataZoom[] | undefined;
        visualMap?: echarts.EChartOption.VisualMap[] | undefined;
        tooltip?: echarts.EChartOption.Tooltip | undefined;
        axisPointer?: echarts.EChartOption.AxisPointer | undefined;
        toolbox?: object | undefined;
        brush?: object | undefined;
        geo?: object | undefined;
        parallel?: object | undefined;
        parallelAxis?: object | undefined;
        singleAxis?: echarts.EChartOption.SingleAxis | echarts.EChartOption.SingleAxis[] | undefined;
        timeline?: object | undefined;
        graphic?: object | object[] | undefined;
        calendar?: echarts.EChartOption.Calendar | echarts.EChartOption.Calendar[] | undefined;
        dataset?: echarts.EChartOption.Dataset | echarts.EChartOption.Dataset[] | undefined;
        aria?: object | undefined;
        series?: echarts.EChartOption.Series[] | undefined;
        color?: string[] | undefined;
        backgroundColor?: string | undefined;
        textStyle?: echarts.EChartOption.BaseTextStyle | undefined;
        animation?: boolean | undefined;
        animationThreshold?: number | undefined;
        animationDuration?: number | undefined;
        animationEasing?: string | undefined;
        animationDelay?: number | Function | undefined;
        animationDurationUpdate?: number | Function | undefined;
        animationEasingUpdate?: string | undefined;
        animationDelayUpdate?: number | Function | undefined;
        progressive?: number | undefined;
        progressiveThreshold?: number | undefined;
        blendMode?: string | undefined;
        hoverLayerThreshold?: number | undefined;
        useUTC?: boolean | undefined;
        type: string;
    };
    getDom: () => HTMLDivElement;
    getWidth: () => number;
    getHeight: () => number;
    isDisposed: () => boolean;
}
declare function getInstanceByDom(dom: HTMLDivElement): Chart | null;
declare function init(chartProps: ChartProps): Chart;
declare const _default: {
    init: typeof init;
    getInstanceByDom: typeof getInstanceByDom;
    echarts: typeof echarts;
};
export default _default;
