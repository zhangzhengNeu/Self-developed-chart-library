import React, { isValidElement } from 'react';
import './index.scss';

const defaultText = '暂无数据';

const NoData = ({ empty = defaultText }) => {
  return (
    <div className="no-data">
      {isValidElement(empty) ? empty : <label className="text">{empty}</label>}
    </div>
  );
};

export default NoData;
