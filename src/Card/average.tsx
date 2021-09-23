import React from 'react';
import CardItem from './CardItem';
import { Params } from './interface';
import { Selected } from './index';

const CardAverage = ({
    data,
    datasetParams,
    selected,
    clickEvent,
}: {
    data: Array<Array<any>>;
    datasetParams: Params;
    selected: Selected;
    clickEvent: Function;
}) => {
    const { 
        selectable = false,
        flow = 'row',
        align = 'left',
        verticalAlign = 'center',
        className = '',
        style = {},
        valueStyle = {},
        formatters = {},
    } = datasetParams?.average ? datasetParams.average : datasetParams;

    return (
        <div className={`rocketChart-card rocketChart-card-average ${className} verticalAlign-${verticalAlign}`} style={style}>
            <div className={`card-group align-${flow}-${align} flow-${flow}`}>
                {
                    data.map(([key, name, value]) => (
                        <CardItem 
                            key={key}
                            selectable={selectable}
                            selected={selected}
                            data={[key, name, value]}
                            style={valueStyle}
                            formatter={formatters[key]}
                            clickEvent={clickEvent}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default CardAverage;