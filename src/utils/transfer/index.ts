import memoize from 'lodash-es/memoize';

import _toDataset from './_toDataset';
import _toDataTable from './_toDataTable';
import _validator from './_validator';

const toDataset = _toDataset;
const toDataTable = memoize(_toDataTable);
const validator = memoize(_validator);

export { toDataset, toDataTable, validator };
