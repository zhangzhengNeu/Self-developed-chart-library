import { SpecificChartConfig } from '../types';

import table from './table';
import line from './line';
import bars from './bar';
import pie from './pie';
import doubleY from './doubleY';
import scatter from './scatter';
import indicator from './indicator';
import card from './card';
import funnel from './funnel';
import map from './map';
import graphs from './graph';

const configs: { [key: string]: SpecificChartConfig } = {
  ...line,
  ...bars,
  ...pie,
  ...doubleY,
  ...table,
  ...scatter,
  ...indicator,
  ...card,
  ...funnel,
  ...map,
  ...graphs,
};

export default configs;
