import ReactDom from 'react-dom';
import legendSelect from './legendSelect';
import { isMobile } from '../utils';
const reactRender = ReactDom.render;
let customTooltip: any = null;

const renderCustomTooltip = (echart: any, param: any) => {
  if (
    param.componentType === 'series' &&
    param.componentSubType === 'custom' &&
    param.value &&
    param.value[2]
  ) {
    const pos = echart.convertToPixel('grid', [param.value[0], param.value[1]]);
    if (customTooltip) {
      customTooltip.style.display = 'flex';
      customTooltip.style.left = `${pos[0] + 20}px`;
      customTooltip.style.top = `${pos[1] - 30}px`;
      reactRender(param.value[2], customTooltip);
    } else {
      const container = document.createElement('div');
      container.style.left = `${pos[0] + 20}px`;
      container.style.top = `${pos[1] - 30}px`;
      container.innerHTML = param.value[2];
      container.className = `custom_tooltip_${echart.id}`;
      const instance = document.querySelector(`[_echarts_instance_=${echart.id}]`);
      if (instance) {
        instance.appendChild(container);
        reactRender(param.value[2], container);
      }
    }
  } else if (customTooltip) {
    // 点坐标轴控制隐藏
    customTooltip.style.display = 'none';
  }
};

export const triggerCustomListener = (echart: any) => {
  const zr = echart.getZr();
  zr.on('click', function ({ target }: { target: any }) {
    // 点空白区域控制隐藏
    customTooltip = document.getElementsByClassName(`custom_tooltip_${echart.id}`)[0];
    if (!target && customTooltip) {
      customTooltip.style.display = 'none';
    }
  });
  echart.on('click', function (param: any) {
    renderCustomTooltip(echart, param);
  });
};


const triggerLegendSelect = (echart: any, reverseSelect: boolean) => {
  echart.on(
    'legendselectchanged',
    ({ name, selected }: { name: number | string; selected: any }) => {
      if (reverseSelect === false) {
        legendSelect(name, selected, echart);
      }
    },
  );
};

const isNumber = (value: any) =>
  typeof value === 'number' && !isNaN(value);

const showOrHideTip = (evt: any, echart: any, tipType: 'showTip' | 'hideTip') => {
  const { xAxis } = echart.getOption();
  const { type = 'category' } = xAxis[0];
  const isReverse = type === 'value';
  const pixel = [evt.zrX, evt.zrY]
  const isHide = tipType === 'hideTip';
  const inArea = echart.containPixel({ seriesIndex: 0 }, pixel);
  if (evt.zrX && evt.zrX && inArea) {
    const [x, y] = echart.convertFromPixel({ seriesIndex: 0 }, pixel);
    isNumber(x) &&
    setTimeout(() => {
      echart.dispatchAction({
        type: tipType,
        seriesIndex: 0,
        dataIndex: isReverse ? parseInt(y) : x,
      })
      isHide && echart.dispatchAction({
        type: 'updateAxisPointer',
        currTrigger: 'leave',
      });
    }, isHide ? 500 : 0)
  }
}

const triggerTooltipListener = (echart: any) => {
  const dom = document.querySelector(`[_echarts_instance_=${echart.id}]`);

  if (dom && isMobile()) {
    dom.addEventListener('touchstart', evt => showOrHideTip(evt, echart, 'showTip'))
    dom.addEventListener('touchmove', evt => showOrHideTip(evt, echart, 'showTip'))
    dom.addEventListener('touchend', evt => showOrHideTip(evt, echart, 'hideTip'))
  }
}

const disposeTooltipListener = (echart: any) => {
  if (echart && echart.id) {
    const dom = document.querySelector(`[_echarts_instance_=${echart.id}]`);
    if (dom && isMobile()) {
      dom.removeEventListener('touchstart', evt => showOrHideTip(evt, echart, 'showTip'))
      dom.removeEventListener('touchmove', evt => showOrHideTip(evt, echart, 'showTip'))
      dom.removeEventListener('touchend', evt => showOrHideTip(evt, echart, 'hideTip'))
    }
  }
}

export default {
  triggerCustomListener,
  triggerLegendSelect,
  triggerTooltipListener,
  disposeTooltipListener,
};
