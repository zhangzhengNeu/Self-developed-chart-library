import React from 'react';
import BasicTable from './Basic';
import CrossTable from './Cross';
import './index.scss';

const Table = (props: any) => {
  const { type, theme = 'default', device = 'desktop' } = props;
  const paddingTop = device === 'mobile' ? 4 : 12;
  return (
    <div
      className={`rocketChart-table rocketChart-table-${theme} rocketChart-table-${device}`}
      style={{ paddingTop }}
    >
      {type.includes('cross') ? <CrossTable {...props} /> : <BasicTable {...props} />}
    </div>
  );
};

export default Table;
