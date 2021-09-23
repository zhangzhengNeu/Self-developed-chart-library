import { SpecificChartConfig } from '../../types';
import basic from './basic';
import cross from './cross';

const tables: { [key: string]: SpecificChartConfig } = {
  'table-basic': basic,
  'table-cross': cross,
};

export default tables;
