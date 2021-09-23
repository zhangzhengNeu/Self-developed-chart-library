import React, { useRef } from 'react';
import { Formatter } from './interface';
import { getFormatter } from '@/utils/valueFormat';
import { Selected } from './index';

const CardItem = ({
    selectable = false,
    selected,
    data = [],
    style = {},
    formatter = {},
    clickEvent,
}: {
    selectable: boolean;
    selected: Selected;
    data: any;
    style: any;
    formatter: Formatter;
    clickEvent: Function;
}) => {
    const cardItemLabel = useRef(null);
    const cardItemValue = useRef(null);
    const [key = '', name = '', value = ''] = data;
    const { type = 'string', prefix = '', suffix = '', valueStyle = {}, labelStyle = {} } = typeof formatter === 'string'
    ? { type: formatter }
    : typeof formatter === 'function'
    ? formatter()
    : formatter;
    const { selectedKey, selectedType } = selected;

    const format = getFormatter(type);
    return (
        <div className="card-item" key={key}>
            <div className={`card-item-label ${selectable ? 'cursor-handler' : ''} ${key === selectedKey && selectedType === 'label' ? 'selected' : ''}`} 
                style={{...labelStyle}} 
                onClick={() => selectable && clickEvent(key, 'label', cardItemLabel.current)}
                ref={cardItemLabel}>
                {name}
            </div>
            <div
                className={`card-item-value ${selectable ? 'cursor-handler' : ''} ${key === selectedKey && selectedType === 'value' ? 'selected' : ''}`} 
                style={{ ...style, ...valueStyle }}
                onClick={() => selectable && clickEvent(key, 'value', cardItemValue.current)}
                ref={cardItemValue}
                >
                <span className="card-item-value-prefix">{prefix}</span>
                <label>{format(value)}</label>
                <span className="card-item-value-suffix">{suffix}</span>
            </div>
        </div>
    )
}

export default CardItem;