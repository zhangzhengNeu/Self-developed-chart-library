import { merge } from 'lodash-es';
import { SpecificChartConfig } from '../../types';
import { getExtremum } from '@/utils';

type Visual = number | 'min' | 'max';

// 最大值、最小值、平均值、中位数
type Kind = 'min' | 'max' | 'average' | 'median' | number
interface VisualGroup {
    visuals: any[Visual]; lineColor: string; color: string[]; seriesIndex?: number; dataset: any;
}
interface MarkerDataSetParams {
    show?: boolean;
    position?: 'insideEndTop' | 'insideEndBottom' | 'insideStartTop' | 'insideStartBottom';
    visuals?: any[];
    pieces?: {
        value: Kind;
        name: string;
    }[];
    visualColor?: string; 
    markLineColor?: string; 
}
const Kind = ['min', 'max', 'average', 'median']

// 计算value的取值
const findMinOrMax = (value: Visual, min: number, max: number): any => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const isMin = value === 'min';
        const isMax = value === 'max';
        if (isMin) return min;
        if (isMax) return max;
    }
}

// pieces结构拼装
const assignArr = (arr: any[]) => {
    const map: any = {}, result = [];
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if (!map[obj.gte + '-' + obj.lte]) {
            map[obj.gte + '-' + obj.lte] = obj;
            result.push(obj)
        }
    }
    return result;
}

const createVisual1 = ({ num1, num2, lineColor, isMiddleNum, isFirstNum, isLastNum, prevNum2, nextNum1, min, max }: any) => {
    const params = [];
    params.push({
        gte: num1,
        lte: num2,
        color: lineColor,
    })
    if (isMiddleNum) {
        prevNum2 && params.push({
            gte: prevNum2,
            lte: num1,
        })
        nextNum1 && params.push({
            gte: num2,
            lte: nextNum1,
        })
    } else if (isFirstNum && num1 > min) {
        params.push({
            gte: min,
            lte: num1,
        })
        nextNum1 && params.push({
            gte: num2,
            lte: nextNum1
        })
    } 
    if (isLastNum && num2 < max) {
        params.push({
            gte: num2,
            lte: max,
        })
    }
    return params;
}

const createVisual2 = ({ num1, lineColor, isMiddleNum, prevNum1, prevNum2, nextNum1, nextNum2, min, max }: any) => {
    const params = [];
    if (isMiddleNum) {
        nextNum1 && params.push({
            gte: num1,
            lte: nextNum1,
            color: lineColor,
        })
        prevNum2 && params.push({
            gte: prevNum2,
            lte: num1,
        })
    } else if (num1 < max) {
        params.push({
            gte: num1,
            lte: nextNum1 || nextNum2 || max,
            color: lineColor,
        })
        params.push({
            gte: prevNum2 || prevNum1 || min,
            lte: num1,
        })
    }
    return params;
}

const createVisual3 = ({ num2, lineColor, isMiddleNum, prevNum1, prevNum2, nextNum1, nextNum2, min, max }: any) => {
    const params = [];
    if (isMiddleNum) {
        prevNum2 && params.push({
            gte: prevNum2,
            lte: num2,
            color: lineColor,
        })
        nextNum1 && params.push({
            gte: num2,
            lte: nextNum1,
        })
    } else if (num2 > min) {
        params.push({
            gte: prevNum2 || prevNum1 || min,
            lte: num2,
            color: lineColor,
        })
        params.push({
            gte: num2,
            lte: nextNum1 || nextNum2 || max,
        })
    }
    return params;
} 

const createVisualGroup = ({ visuals, lineColor, color, seriesIndex = 0, dataset }: VisualGroup) => {
    const arr = getExtremum.series(dataset);
    const [min, max] = arr[seriesIndex];
    const visualsMap: any = [];
    // 对visuals做从小到大的排序
    visuals.forEach((item: any[], cursor: number) => {
        const [value1 = Infinity, value2 = Infinity] = item;
        const v1 = findMinOrMax(value1, min, max);
        const v2 = findMinOrMax(value2, min, max);
        const minValue = v1 > v2 ? v2 : v1;
        visualsMap[cursor] = minValue;
    })
    const sortOrder = Object.keys(visualsMap).sort((a, b) => visualsMap[a] - visualsMap[b]);
    const newVisuals: any[] = [];
    for (const order of sortOrder) {
        newVisuals.push(visuals[order]);
    }

    // 连接断续数字
    const len = newVisuals.length;
    if (!len) return [];
    const data = newVisuals.map((item, cursor) => {
        const [num1, num2] = item;
        let params: any[] = [];
        // 取区间值
        const isMiddleNum = cursor !== 0 && cursor !== len - 1;
        const isFirstNum = cursor === 0;
        const isLastNum = cursor === len - 1;
        const prevNum = newVisuals[cursor - 1];
        const nextNum = newVisuals[cursor + 1];
        const prevNum1 = prevNum ? prevNum[0] : null;
        const prevNum2 = prevNum ? prevNum[1] : null;
        const nextNum1 = nextNum ? nextNum[0] : null;
        const nextNum2 = nextNum ? nextNum[1] : null;
        const commonParams = { lineColor, isMiddleNum, isLastNum, prevNum2, nextNum1, min, max, color };
        if (num1 && num2) {
            // 取区间
            params = params.concat(createVisual1({ ...commonParams, num1, num2, isFirstNum }));
        } else if (num1) {
            // 取大于
            params = params.concat(createVisual2({ ...commonParams, num1, prevNum1, nextNum2 }))

        } else if (num2) {
            // 取小于
            params = params.concat(createVisual3({ ...commonParams, num2, prevNum1, nextNum2 }))
        }
        return params.flat(1);
    })
    const pieces = assignArr(data.flat(1));
    return [{
        seriesIndex: seriesIndex || 0,
        show: false,
        dimension: 1, // 仅用于y轴
        inRange: {
            color: color[seriesIndex]
        },
        pieces,
    }]
}

// 创建标记线
const createMarkLineGroup = ({ pieces, markLineColor, show, position }: any) => {
    if (!show) return {};
    const addParams = (value: Kind | string, name: string | number) => {
        const params: any = {
            lineStyle: {
                color: markLineColor,
            },
            label: {
                position,
            }
        }
        const inKind = typeof value === 'string' && Kind.includes(value);
        inKind && (params.type = value);
        typeof value === 'number' && (params.yAxis = value)
        params.label.formatter = name || '';
        return params;
    }
    const data = pieces.map((piece: {
        value: Visual;
        name: string | number;
    }) => { 
        const { value = 'min', name = value } = piece;
        return addParams(value, name)
    });
    return {
        symbol: 'none',
        data: data.flat(1),
    }
}



const config: SpecificChartConfig = {
  defaultChartProps: {},

  optionHandler(options, datasetParams: MarkerDataSetParams = {}, config: any) {
    const { series, dataset } = options;
    if (!series || !series.length) { 
        throw new Error('series未定义或者series长度小于1')
    }
    // 默认的颜色
    const { themeConfig: { color } } = config;
    const { 
        // 是否显示标记线markLine
        show = true,
        // 标记线显示位置
        position = 'insideStartTop',
        // 分段配置
        visuals = [],
        // markLine配置
        pieces = [], 
        // 分段颜色
        visualColor = 'red', 
        // 标记线颜色
        markLineColor = '#666', 
    } = datasetParams;
    merge(series[0], {
        markLine: createMarkLineGroup({ pieces, markLineColor, show, position }),
    })
    const visualParams: VisualGroup = {
        visuals, lineColor: visualColor, color, dataset
    } 
    options.visualMap = createVisualGroup(visualParams);
    // dataset格式暂不支持多线段分段
    // if (len > 1) {
    //     let visualMap: any[] = [];
    //     Object.values(datasetParams).forEach((item, cursor) => {
    //         const {
    //             show = true,
    //             position = 'insideStartTop',
    //             visuals = [],
    //             pieces = [], 
    //             names = [], 
    //             lineColor = '#aaa', 
    //             markLineColor = '#aaa',
    //         } = item;
    //         merge(series[cursor], {
    //             markLine: createMarkLineGroup({ pieces, names, markLineColor, show, position }), 
    //         })
    //         visualMap = visualMap.concat(createVisualGroup(visuals, lineColor, cursor))
    //     })
    //     // console.log('options.visualMap', visualMap)
    //     options.visualMap = visualMap;
    // } else if (len === 1) {

        // console.log('series', series)
    // } else {
    //     throw new TypeError('datasetParams must be object or array')
    // }
  },
};

export default config;

