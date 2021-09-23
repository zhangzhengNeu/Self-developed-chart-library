/**
 * dataset.source 数组第一项 必须转换为string ！
 */
import { every, isPlainObject } from 'lodash-es';
import { Data } from '../../types';

const _toDataset = (data: Data) => {
  const { target = [], source, links, categoryKey } = data;

  // source:{}
  if (isPlainObject(source) && !links) {
    return { source };
  } else if (isPlainObject(source) && links) {
    return { source, links: links, target, categoryKey };
  }

  let unNamedIndex = 0;
  const nameList = target.map((item) => {
    if (typeof item.name === 'undefined') {
      return `未知${++unNamedIndex}`;
    }
    return item.name + '';
  });

  // source:[{},{}]
  if (every(source, isPlainObject) && !links) {
    const result: any[] = [];
    target.forEach(({ key }, i) => {
      const name = nameList[i];
      const list = [name];
      source.forEach((item: any) => {
        list.push(item[key]);
      });
      result.push(list);
    });
    return { source: result };
  } else if (every(source, isPlainObject) && links) {
    const result: any[] = [];
    target.forEach(({ key }, i) => {
      const name = nameList[i];
      const list = [name];
      source.forEach((item: any) => {
        list.push(item[key]);
      });
      result.push(list);
    });
    return { source: result, links: links, target, categoryKey };
  }

  // source:[[1,2],[1,2]]
  // or
  // source:[[{},{}],[{},{}]]
  if (Array.isArray(source) && every(source, Array) && !links) {
    const result = nameList.map((name, i) => {
      const data = source[i] || [];
      return [name, ...data];
    });
    return { source: result };
  } else if (Array.isArray(source) && every(source, Array) && links) {
    const result = nameList.map((name, i) => {
      const data = source[i] || [];
      return [name, ...data];
    });
    return { source: result, links: links, target, categoryKey };
  }

  // Otherwise
  return data;
};

export default _toDataset;
