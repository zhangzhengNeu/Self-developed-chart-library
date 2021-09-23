import React from 'react';
import { renderNumeralMap } from '@/utils';
import { BaseIndicatorProps, List } from './interface';
import './styles/index.scss';

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

const renderText = (ele: List) => {
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
  // 如果是组件直接渲染
  if (ele.icon && typeof ele.icon === 'object') {
      return ele.icon;
  } else if (ele.value && Number(ele.value) !== 0){
      // 渲染指定图标
      return <span className='card-footer-item-icon'>{ renderIcon(ele.value) }</span>;
  }
}

const renderArrayFooter = (footer: List[]) => {
  const footerCont: any[] = [];
  footer.slice(0, 2).forEach((ele, cursor) => {
    footerCont.push(<div className="card-footer-item" key={ele.key || cursor}>
      <span className="card-footer-item-title">{ele.name || constants.nameMap[cursor]}</span>
      <span className="card-footer-item-text">{renderText(ele)}</span>
      { renderFooterIcon(ele) }
    </div>);
  });
  return footerCont;
}

const renderFooter = (footer: string | Function | List[]) => {
  let footerCont: any = '';
  if(Array.isArray(footer)){
    footerCont = renderArrayFooter(footer);
  }else{
    footerCont = footer;
  }
  return footerCont;
}

const RocketIndicator = ({
    datasetParams,
}: {
  datasetParams: {
    basic: BaseIndicatorProps;
  };
}) => {
    const { basic = { cont :'', unit: '' , compare: '' }} = datasetParams;
    const { cont = '', unit , compare = '' } = basic;
    return (
        <div className={`base-rocketChart-indicator`} key='rocketChart-indicator'>
          <div className='card-cont'>
              {cont}
              {unit ? <span className='card-cont-unit'>{unit}</span> : null}
          </div>
          <div className='card-footer'>{renderFooter(compare)}</div>
        </div>
    );
}

export default RocketIndicator;