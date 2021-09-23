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
 *
 * output
 * [
  {
    date: "2019-09-08",
    shareCount: 6236
  },
  {
    date: "2019-09-07",
    shareCount: 5595
  },
  {
    date: "2019-09-06",
    shareCount: 5257
  }
]
 *
 */
import { Data } from '../../types';
declare const _default: (data: Data) => any[];
export default _default;
