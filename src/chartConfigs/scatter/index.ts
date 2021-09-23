import { SpecificChartConfig } from '../../types';
import basic from './basic';
import regression from '../common/regression';
import dataZoom from '../common/dataZoom';

const scatter: { [key: string]: SpecificChartConfig } = {
  'scatter-basic': basic,
  'scatter-regression': regression,
  'scatter-dataZoom': dataZoom,
};

export default scatter;
