import React from 'react';
import { renderNumeralMap } from '@/utils';
import { List, ContList, MultiIndicatorProps } from './interface';
import './styles/multiCard.scss';

const constants = {
    nameMap: ['同比', '环比']
}

const renderIcon = (value: string | number) => {
    return value.toString().includes('-') ? 
    <i className='anticon' style={{color: "#04A2A4",transform: "rotate(180deg)"}}>
      <svg id="icon-jiantou" width='1em' height='1em' fill='currentColor' viewBox="0 0 1024 1024"><path d="M137.93433786 933.875h746.92493976c34.76850183 0 60.5614812-40.94887912 40.25009262-81.36978579-16.24290024-32.40815735-344.6103587-680.15202402-372.68604108-735.37167207-18.43243067-36.30583163-62.45596939-35.71574551-80.88839923 0C450.8819116 156.90224819 120.80630845 807.09963192 97.90164517 854.16677301c-16.8019291 34.47345877 1.75472974 79.70822699 40.03269269 79.70822699z"></path></svg> 
    </i>
    : 
    <i className='anticon' style={{color: "#D87A80"}}>
      <svg id="icon-jiantou" width='1em' height='1em' fill='currentColor' viewBox="0 0 1024 1024"><path d="M137.93433786 933.875h746.92493976c34.76850183 0 60.5614812-40.94887912 40.25009262-81.36978579-16.24290024-32.40815735-344.6103587-680.15202402-372.68604108-735.37167207-18.43243067-36.30583163-62.45596939-35.71574551-80.88839923 0C450.8819116 156.90224819 120.80630845 807.09963192 97.90164517 854.16677301c-16.8019291 34.47345877 1.75472974 79.70822699 40.03269269 79.70822699z"></path></svg>
    </i>;
}

const renderText = (ele: List | ContList) => {
    if (!ele.preRender) {
        return renderNumeralMap['string'](ele.value);
    } else if (ele.preRender){
        if (typeof ele.preRender === 'string' && renderNumeralMap[ele.preRender]) {
            return renderNumeralMap[ele.preRender](ele.value);
        } else if (typeof ele.preRender === 'function') {
            return ele.preRender(ele.value);
        } else return ele.value;
    }
}

const renderFooterIcon = (ele: List) => {
    if (ele.icon && typeof ele.icon === 'object') {
        return ele.icon;
    } else if (ele.value && Number(ele.value) !== 0) {
        return <span className='card-main-row-footer-item-text-icon'>{ renderIcon(ele.value) }</span>;
    }
}

const renderArrayFooter = (footer: List[]) => {
    const footerCont: any[] = [];
    footer.slice(0, 2).forEach((ele, cursor) => {
      footerCont.push(<div className="card-main-row-footer-item" key={ele.key || cursor}>
        <div className="card-main-row-footer-item-title">{ele.name || constants.nameMap[cursor]}</div>
        <div className="card-main-row-footer-item-text" style={{ color: ele.value && ele.value.toString().includes('-') ? '#04A2A4' : '#D87A80'}}>
            {renderText(ele)}
            {renderFooterIcon(ele)}
        </div>
      </div>);
    });
    return footerCont;
  }

const renderFooter = (footer: List[]) => {
    let footerCont: any = '';
    if(Array.isArray(footer)){
      footerCont = renderArrayFooter(footer);
    }else{
      footerCont = footer;
    }
    return footerCont;
}

const renderMainCont = (cont: string | number | Function | ContList[])  => {
    let mainCont = null;
    if(Array.isArray(cont)){
        mainCont = [];
        cont.forEach((ele, cursor) => {
            const {
                key,
                name,
                unit,
                compare,
            } = ele;
            mainCont.push(<div className='card-main-row' key={key || cursor}>
            <div className='card-main-row-cont'>
                <div className='card-main-row-cont-title'>
                    <span className='card-main-row-cont-title-name'>{name}</span>
                </div>
                <div className='card-main-row-cont-value'>
                    {renderText(ele)}
                    <span className='card-main-row-cont-value-unit'>{unit}</span>
                </div>
            </div>
            <div className='card-main-row-footer'>
                {compare && renderFooter(compare)}
            </div>
        </div>);
        });
    } else {
        mainCont = cont;
    }
    return mainCont;
}

const MultiRocketIndicator = ({
    datasetParams,
}: {
    datasetParams: {
        multi: MultiIndicatorProps;
    };
}) => {
    const { multi = { cont: [] }  } = datasetParams;
    const { cont = [] } = multi;
    return (
        <div className={`multi-rocketChart-indicator`} key='rocketChart-indicator'>
            <div className='card-main'>
                {renderMainCont(cont)}
            </div>
        </div>
    )
}

export default MultiRocketIndicator;