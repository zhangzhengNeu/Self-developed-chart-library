export interface Formatter {
    [key: string]: {
        type?: 'number' | 'decimal' | 'integer' | 'percent' | 'string' | 'abbr';
        prefix?: string;
        suffix?: string;
        labelStyle?: {};
        valueStyle?: {};
    } | Function | string;
}
export interface Params {
    flow?: 'row' | 'column';
    align?: 'left' | 'center' | 'right' | 'around' | 'between';
    verticalAlign?: 'top' | 'center' | 'bottom';
    className?: any;
    style?: any;
    valueStyle?: any;
    formatters?: Formatter;
}
