import { SpecificChartConfig } from '../../types';
import common from '../common';

import basic from './basic';
import markLine from './markLine';
import peak from './peak';
import regression from '../common/regression';
import smooth from './smooth';
import area from './area';
import areaStack from './areaStack';
import marker from './marker';
import holiday from './holiday';

const lines: { [key: string]: SpecificChartConfig } = {
  'line-basic': basic,
  'line-autoSum': common.autoSum,
  'line-autoOther': common.autoOther,
  'line-maxTag': common.maxTag,
  'line-markLine': markLine,
  'line-peak': peak,
  'line-calendar': common.calendar,
  'line-regression': regression,
  'line-smooth': smooth,
  'line-hideSymbol': common.hideSymbol,
  'line-label': common.label,
  'line-dataZoom': common.dataZoom,
  'line-autoYAxis': common.autoYAxis,
  'line-holiday': holiday,
  'line-area': area,
  'line-areaStack': areaStack,
  'line-marker': marker,
};

export default lines;
