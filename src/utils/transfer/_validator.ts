/**
 *
 * input
 * {
  target: [{key: "date", name: "日期"}, {key: "shareCount", name: "分享次数"}],
  source: [
	["2019-09-08", "2019-09-07", "2019-09-06"],
	[6236, 5595, 5257]
  ]
}
 */

import { Data } from '../../types';
import { isObject, isArray } from 'lodash-es';
export default (data: Data) => {
  if (!isObject(data)) {
    return false;
  }
  if (!isArray(data.target) || !isArray(data.source)) {
    return false;
  }
  return !(data.target.length === 0 || data.source.length === 0);
};
