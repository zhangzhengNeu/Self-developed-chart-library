const renderDrawItem = (api: any, text?: string, point: { fill?: string; stroke?: string }, bottom: boolean, trigger: string) => {
  const height = api.getHeight();
  const width = api.getWidth();
  let direction = bottom ? 'bottom' : 'top';
  let textAlign = 'right';
  if (api.value(0) && api.value(1)) {
    const pos = api.coord([api.value(0), api.value(1)]);
    if (pos[1] <= 80) { direction = 'bottom' };
    if (pos[1] + 80 >= height) { direction = 'top' };
    if (pos[0] + 80 >= width) { textAlign = 'left' };
    const initialConfig = {
      circle: { 
        r: 4,
        borderWidth: 2,
        fill: point.fill || '#4d6e99',
        stroke: point.stroke || '#4d6e99'
      },
      line: {
        length: 30,
      },
      text: {
        fontSize: 12,
        color: '#787878'
      }
    }
    let customSeries: any = [{
      type: 'circle',
      shape: {
        r: initialConfig['circle'].r,
      },
      position: pos,
      style: {
        fill: initialConfig['circle'].fill,
        stroke: initialConfig['circle'].stroke,
        lineWidth: initialConfig['circle'].borderWidth,
      }
    }];
    if (trigger !== 'click') {
      const isBottom = direction === 'bottom';
      const isRight = textAlign === 'right';
      const circleLength = initialConfig['circle'].borderWidth + initialConfig['circle'].r;
      const lineY1 = isBottom ? pos[1] + circleLength : pos[1] - circleLength;
      const lineY2 = isBottom ? lineY1 + initialConfig['line'].length : lineY1 - initialConfig['line'].length;
      const textY = isBottom ? lineY2 : lineY2 - 10;
      customSeries = [...customSeries, {
        type: 'line',
        shape: {
          x1: pos[0],
          y1: lineY1,
          x2: pos[0],
          y2: lineY2,
        },
        style: {
          stroke: '#cdcdcd',
        }
      }, {
        type: 'text',
        style: {
          text: text,
          x: isRight ? pos[0] + 5 : pos[0] - 80,
          y: textY,
          fontSize: initialConfig['text'].fontSize,
          fill: initialConfig['text'].color
        }
      }];
    }
    return {
      type: 'group',
      children: customSeries
    }
  }
}

export default {
  renderDrawItem
}