import { SpecificChartConfig } from '../../types';
import basic from './basic';
import common from '../common';

const maps: { [key: string]: SpecificChartConfig } = {
  'map-basic': basic,
  'map-label': common.label,
};

export default maps;
