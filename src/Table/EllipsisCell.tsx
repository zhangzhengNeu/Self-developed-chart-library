import React, { useState, useLayoutEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';

const EllipsisCell: React.FC<{ value: string | number; width?: number }> = ({
  value,
  width,
  children,
}) => {
  const [ref, setRef] = useState<HTMLDivElement>();
  const [isEllipsis, setIsEllipsis] = useState(false);
  useLayoutEffect(() => {
    if (!ref) {
      return;
    }
    setIsEllipsis(ref.offsetWidth < ref.scrollWidth);
  }, [ref, value, width]);
  const result = children || value;
  return (
    <div
      ref={(node) => node && setRef(node)}
      key={value}
      className="rocket-chart-ellipsisCell"
      style={{ width: width || '' }}
    >
      {isEllipsis ? (
        <Tooltip
          arrow
          placement="top"
          title={value}
          interactive
          classes={{ tooltip: 'rocket-tooltips' }}
        >
          <div>{result}</div>
        </Tooltip>
      ) : (
        result
      )}
    </div>
  );
};

export default EllipsisCell;
