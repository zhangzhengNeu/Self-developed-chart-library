// 判断图是否翻转
export default (xAxis?: { [index: string]: any }, yAxis?: { [index: string]: any }) => {
  const isReverse = xAxis && xAxis.type === 'value' && yAxis && yAxis.type === 'category';
  return isReverse;
};
