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
export default (data: Data) => {
  const { target, source } = data;
  const row_0 = target.map(item => item.key);
  const output: any[] = [];
  source[0].forEach((col: any, i: number) => {
    const item: { [key: string]: any } = {};
    row_0.forEach((row, j) => {
      item[row] = source[j][i];
    });
    output.push(item);
  });
  return output;
};
