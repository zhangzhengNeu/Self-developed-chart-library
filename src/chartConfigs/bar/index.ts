import { SpecificChartConfig } from '../../types';
import basic from './basic';
import label from '../common/label';
import hideSymbol from '../common/hideSymbol';
import reverse from '../common/reverse';
import dataZoom from '../common/dataZoom';
import stack from './stack';
import hideAxis from './hideAxis';
import percent from './percent';
import range from './range';
import stackPercent from './stackPercent';

const bars: { [key: string]: SpecificChartConfig } = {
  'bar-basic': basic,
  'bar-label': label,
  'bar-hideSymbol': hideSymbol,
  'bar-reverse': reverse,
  'bar-stack': stack,
  'bar-hideAxis': hideAxis,
  'bar-percent': percent,
  'bar-range': range,
  'bar-dataZoom': dataZoom,
  'bar-stackPercent': stackPercent,
};

export default bars;
