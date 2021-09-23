import { SpecificChartConfig } from '../../types';
import basic from './basic';
import ring from './ring';
import ringIndicator from './ring_indicator';
import common from '../common';
import autoOther from './autoOther';

const pies: { [key: string]: SpecificChartConfig } = {
  'pie-basic': basic,
  'pie-ring': ring,
  'pie-hideSymbol': common.hideSymbol,
  'pie-ringIndicator': ringIndicator,
  'pie-autoOther': autoOther,
};

export default pies;
