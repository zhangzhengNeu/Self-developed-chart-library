interface NumeraType {
    decimal: Function;
    number: Function;
    integer: Function;
    percent: Function;
    string: Function;
    abbr: Function;
    [propName: string]: any;
}
declare const renderNumeralMap: NumeraType;
declare const getFormatter: (format?: string) => any;
export { getFormatter, renderNumeralMap };
