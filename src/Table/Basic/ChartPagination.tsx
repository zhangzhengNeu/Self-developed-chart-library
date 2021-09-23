import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import NativeSelect from '@material-ui/core/NativeSelect';

const ChartPagination: React.FC<any> = (props) => {
  const { show, page, total, onChange } = props;
  if (!show) {
    return null;
  }

  function change(e: any) {
    const pageSize = +e.target.value;
    onChange(undefined, pageSize);
  }

  const count = Math.ceil(total / page.size);

  return (
    <div className="rocketChart-table-pagination">
      <Pagination
        size="small"
        shape="rounded"
        variant="outlined"
        count={count}
        onChange={(e, page) => {
          onChange(page);
        }}
      />
      <NativeSelect
        variant="outlined"
        onChange={change}
        value={page.size}
        style={{ fontSize: '12px' }}
      >
        {page.sizeOptions.map((item: any) => (
          <option key={item} value={item}>
            {`${item} 条/页`}
          </option>
        ))}
      </NativeSelect>
      <span className="rocketChart-table-total">{`共 ${total} 条`}</span>
    </div>
  );
};

export default ChartPagination;
