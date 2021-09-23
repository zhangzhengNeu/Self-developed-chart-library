export default function (legend: string | number, selected: any, echart: any) {
  let isBegin = true;
  for (const name in selected) {
    if (selected.hasOwnProperty(name)) {
      if (name === legend) {
        if (selected[name] === true) {
          isBegin = false;
        }
      } else {
        if (selected[name] === false) {
          isBegin = false;
        }
      }
    }
  }

  if (isBegin) {
    for (const name in selected) {
      if (selected.hasOwnProperty(name)) {
        if (name === legend) {
          echart.dispatchAction({ type: 'legendSelect', name });
        } else {
          echart.dispatchAction({ type: 'legendUnSelect', name });
        }
      }
    }
  } else {
    if (selected[legend]) {
      for (const name in selected) {
        if (selected.hasOwnProperty(name)) {
          if (name === legend) {
            echart.dispatchAction({ type: 'legendSelect', name });
          } else {
            echart.dispatchAction({ type: 'legendUnSelect', name });
          }
        }
      }
    } else {
      for (const name in selected) {
        if (selected.hasOwnProperty(name)) {
          echart.dispatchAction({ type: 'legendSelect', name });
        }
      }
    }
  }
}
