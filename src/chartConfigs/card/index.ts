import { SpecificChartConfig } from '../../types';
import cardBasic from './basic';
import cardAverage from './average';

const indicator: { [key: string]: SpecificChartConfig } = {
  'card-basic': cardBasic,
  'card-average': cardAverage
};

export default indicator;
