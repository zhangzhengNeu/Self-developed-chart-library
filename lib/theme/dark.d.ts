declare const _default: {
    backgroundColor: string;
    grid: {
        top: number;
        left: string;
        right: string;
        bottom: string;
        containLabel: boolean;
    };
    tooltip: {
        confine: boolean;
        show: boolean;
        trigger: string;
        axisPointer: {
            type: string;
            lineStyle: {
                color: string;
            };
        };
        borderWidth: number;
        padding: number;
        extraCssText: string;
        borderColor: string;
        backgroundColor: string;
        textStyle: {
            color: string;
            fontSize: number;
            fontFamily: string;
            fontWeight: number;
        };
        formatter: (params: any) => string;
    };
    legend: {
        top: string;
        type: string;
        itemWidth: number;
        itemHeight: number;
        padding: number;
        icon: string;
        selectedMode: boolean;
        textStyle: {
            color: string;
            fontFamily: string;
            fontSize: number;
        };
        formatter: (text?: string) => string;
    };
    categoryAxis: {
        splitLine: {
            show: boolean;
        };
        axisLine: {
            show: boolean;
            lineStyle: {
                color: string;
            };
        };
        axisTick: {
            show: boolean;
            lineStyle: {
                color: string;
            };
            alignWithLabel: boolean;
        };
        axisLabel: {
            color: string;
            fontFamily: string;
            fontSize: number;
            fontWeight: string;
        };
        triggerEvent: boolean;
    };
    valueAxis: {
        splitLine: {
            show: boolean;
            lineStyle: {
                type: string;
                width: number;
            };
        };
        axisLine: {
            show: boolean;
            lineStyle: {
                color: string;
            };
        };
        axisTick: {
            show: boolean;
        };
        axisLabel: {
            color: string;
            fontFamily: string;
            fontSize: number;
            fontWeight: string;
        };
        triggerEvent: boolean;
    };
    line: {
        seriesLayoutBy: string;
        showSymbol: boolean;
        showAllSymbol: boolean;
        label: {
            show: boolean;
        };
    };
    pie: {
        seriesLayoutBy: string;
        label: {
            show: boolean;
        };
        tooltip: {
            trigger: string;
        };
        legend: boolean;
    };
    bar: {
        seriesLayoutBy: string;
        barMaxWidth: string;
    };
    scatter: {
        seriesLayoutBy: string;
    };
    funnel: {
        seriesLayoutBy: string;
        tooltip: {
            trigger: string;
        };
    };
    map: {
        seriesLayoutBy: string;
    };
} & {
    color: string[];
    backgroundColor: string;
    legend: {
        inactiveColor: string;
        textStyle: {
            color: string;
        };
    };
    categoryAxis: {
        axisLabel: {
            textStyle: {
                color: string;
            };
        };
        axisLine: {
            lineStyle: {
                color: string;
            };
        };
        axisTick: {
            lineStyle: {
                color: string;
            };
        };
    };
    valueAxis: {
        splitLine: {
            lineStyle: {
                color: string;
            };
        };
        axisLabel: {
            textStyle: {
                color: string;
            };
        };
    };
    tooltip: {
        extraCssText: string;
        backgroundColor: string;
        textStyle: {
            color: string;
        };
    };
};
export default _default;
