data1 = {
  target: [
    { key: 'date', name: '日期', type: 'date' },
    { key: 'show', name: '浏览', type: 'number' },
  ],
  source: [
    ['2019-09-08', '2019-09-07', '2019-09-06'],
    [6236, 5595, 5257],
  ],
};
dataset1.source = [
  ['日期', '2019-09-08', '2019-09-07', '2019-09-06'],
  ['浏览', 6236, 5595, 5257],
];

data2 = {
  target: [
    { key: 'date', name: '日期', type: 'date' },
    { key: 'show', name: '浏览', type: 'number' },
  ],
  source: [
    [{ value: '2019-09-08' }, { value: '2019-09-07' }, { value: '2019-09-06' }],
    [
      { value: 1, color: 'red' },
      { value: 1, color: 'red' },
      { value: 1, color: 'red' },
    ],
  ],
};
dataset2.source = [
  ['日期', { value: '2019-09-08' }, { value: '2019-09-07' }, { value: '2019-09-06' }],
  ['浏览', { value: 1, color: 'red' }, { value: 1, color: 'red' }, { value: 1, color: 'red' }],
];

data3 = {
  target: [
    { key: 'date', name: '日期', type: 'date' },
    { key: 'show', name: '浏览', type: 'number' },
  ],
  source: [
    { date: '2019-09-08', show: 1 },
    { date: '2019-09-09', show: 2 },
    { date: '2019-09-10', show: 3 },
  ],
};
dataset3.source = [
  ['日期', '2019-09-08', '2019-09-09', '2019-09-10'],
  ['浏览', 1, 2, 3],
];

data4 = {
  target: [],
  source: {
    nodes: [
      { name: '浏览', value: 1 },
      { name: '点击', value: 2 },
      { name: '点击2', value: 3 },
    ],
    links: [
      { source: '浏览', target: '点击', value: 236 },
      { source: '浏览', target: '点击2', value: 6000 },
    ],
    aaaa: {},
    xxxx: [],
  },
};
dataset4.source = {
  nodes: [
    { name: '浏览', value: 1 },
    { name: '点击', value: 2 },
    { name: '点击2', value: 3 },
  ],
  links: [
    { source: '浏览', target: '点击', value: 236 },
    { source: '浏览', target: '点击2', value: 6000 },
  ],
  aaaa: {},
  xxxx: [],
};
