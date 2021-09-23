import { Formatter } from './interface';
import { Selected } from './index';
declare const CardItem: ({ selectable, selected, data, style, formatter, clickEvent, }: {
    selectable: boolean;
    selected: Selected;
    data: any;
    style: any;
    formatter: Formatter;
    clickEvent: Function;
}) => JSX.Element;
export default CardItem;
