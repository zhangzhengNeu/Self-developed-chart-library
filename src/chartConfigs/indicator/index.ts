import { SpecificChartConfig } from '../../types';
import basic from './basic';
import multi from './multi';

const indicator: { [key: string]: SpecificChartConfig } = {
  'indicator-basic': basic,
  'indicator-multi': multi,
};

export default indicator;
