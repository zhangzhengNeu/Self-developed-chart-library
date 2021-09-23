import { SpecificChartConfig } from '../../types';

import basic from './basic';
import contrast from './contrast';
import column from './column';
import hideSymbol from '../common/hideSymbol';

const funnels: { [key: string]: SpecificChartConfig } = {
  'funnel-basic': basic,
  'funnel-contrast': contrast,
  'funnel-column': column,
  'funnel-hideSymbol': hideSymbol,
};

export default funnels;
