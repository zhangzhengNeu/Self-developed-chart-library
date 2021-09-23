import { every, isPlainObject, cloneDeep } from 'lodash-es';
import { Data, Formatters } from '../types';

const dataFormate: (data: Data, formatters?: Formatters, type?: string) => Data = (
  data,
  formatters = {},
) => {
  const { target, source, links, categoryKey, type } = data;
  const newSource = cloneDeep(source);

  //关系图不写target的话，source取不到，所以在这里塞上
  if (type.split('-')[0] == 'graph') {
    target.push(
      { key: 'symbolSize', name: '圆点尺寸' },
      { key: 'x', name: 'x' },
      { key: 'y', name: 'y' },
    );
  }
  // source:{}
  if (!Array.isArray(newSource)) {
    return data;
  }

  for (const [key, formater] of Object.entries(formatters)) {
    // source:[{},{}]
    if (every(source, isPlainObject)) {
      newSource.forEach((item) => {
        item[key] = formater(item[key]);
      });
    }
    // source:[[1,2],[1,2]]
    if (every(source, Array)) {
      const sourceIndex = target.findIndex((item) => item.key === key);
      sourceIndex !== -1 &&
        (newSource[sourceIndex] = newSource[sourceIndex].map((item: any) => formater(item)));
    }
  }
  // source:[[{},{}],[{},{}]]
  return { target, source: newSource, links, categoryKey };
};

export default dataFormate;
