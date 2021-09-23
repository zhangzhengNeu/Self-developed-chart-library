export interface FunnelColumnProps {
    target: object[];
    source: [];
    colors: string[];
    sort: string;
    hideSymbol: boolean;
}
export interface FunnelItemProps {
    color: string;
    hideSymbol: boolean;
    name: string;
    value: number;
    maxValue: number;
    lastValue: number | undefined;
    step: number;
    renderItemInfo: Function;
}
