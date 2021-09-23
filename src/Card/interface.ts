export interface Formatter {
    [key: string]: {
        type?: 'number' | 'decimal' | 'integer' | 'percent' | 'string' | 'abbr';
        prefix?: string;
        suffix?: string;
        labelStyle?: {};
        valueStyle?: {};
    }
    | Function | string;
}

export interface Params {
    // 排列方式，column或者row，默认row
    flow?: 'row' | 'column';
    // 左中右、均等、两端
    // left | center | right | around  | between
    align?: 'left' | 'center' | 'right' | 'around' | 'between';
    // 垂直对齐方式: top | center | bottom，默认 top
    verticalAlign?: 'top' | 'center' | 'bottom';
    className?: any;
    // 外层容器样式
    style?: any;
    // 数值样式
    valueStyle?: any;
    formatters?: Formatter;
}

