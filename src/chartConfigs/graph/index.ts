import { SpecificChartConfig } from '../../types';
import graphBasic from './basic';
import graphCircular from './circular';
import graphCustom from './custom';

const graphs: { [key: string]: SpecificChartConfig } = {
  'graph-basic': graphBasic,
  'graph-circular': graphCircular,
  'graph-custom': graphCustom,
};

export default graphs;
