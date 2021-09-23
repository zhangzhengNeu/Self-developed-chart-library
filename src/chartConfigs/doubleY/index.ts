import { SpecificChartConfig } from '../../types';
import basic from './basic';
import autoYAxis from './autoYAxis';
import label from '../common/label';
import common from '../common';

const doubleY: { [key: string]: SpecificChartConfig } = {
  'doubleY-basic': basic,
  'doubleY-label': label,
  'doubleY-autoYAxis': autoYAxis,
  'doubleY-dataZoom': common.dataZoom,
};

export default doubleY;
