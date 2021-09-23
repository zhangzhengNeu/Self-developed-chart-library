import React from 'react';
import CardItem from './CardItem';
import { Params } from './interface';
import { Selected } from './index';

const CardBasic = ({
    data,
    datasetParams,
    selected,
    clickEvent,
}: {
    data: Array<Array<any>>;
    datasetParams: Params;
    selected: Selected;
    setSelected: Function;
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
    } = datasetParams?.basic ? datasetParams.basic : datasetParams;

    const [data0, ...dataSec] = data;
    
    return (
        <div className={`rocketChart-card rocketChart-card-basic ${className} verticalAlign-${verticalAlign}`} style={style}>
            <div className={`card-group card-main align-${flow}-${align}`}>
                <CardItem 
                    key={data0[0]}
                    selected={selected}
                    selectable={selectable} 
                    data={data0} 
                    style={valueStyle} 
                    formatter={formatters[data0[0]]} 
                    clickEvent={clickEvent}
                />
            </div>
            <div className={`card-group card-sec align-${flow}-${align} flow-${flow}`}>
                {
                    dataSec.map(([key, name, value]) => (
                        <CardItem 
                            key={key}
                            selected={selected}
                            selectable={selectable}
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

export default CardBasic;