const addPx = (size: string) => Math.round(parseFloat(size)) + 'px'; 

/**
 * 获取dom节点样式
 * @param dom 
 */
export const getInitialStyle = (dom: any): object => {
    const { color, fontFamily, fontSize } = getComputedStyle(dom);
    return {
        color,
        fontFamily,
        fontSize: addPx(fontSize),
    }
}

/**
 * 获取初始datasetParams
 * @param params datasetParams
 * @param type 图表类型
 */
export const getInitialParams = (params: any, type: string) => {
    if (JSON.stringify(params) === '{}') return params;
    if (type === 'card-basic') {
        return params?.basic ? params.basic : params;
    } else if (type === 'card-average') {
        return params?.average ? params.average : params;
    }
}
