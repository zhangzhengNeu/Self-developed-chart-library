import React, { useState, useEffect } from 'react';
import Basic from './basic';
import Average from './average';
import { getInitialStyle, getInitialParams } from './utils';
import './index.scss';

export type Selected = { selectedKey: string | null; selectedType: 'label' | 'value' | null };

const Card = (props: any) => {
  const {
    type,
    data,
    chartOptions: { dataset: { source = [] } = {} },
    datasetParams = {},
    ...otherProps
  } = props;

  const isCardAverage = type === 'card-average';

  const {
    selectable = false,
    onSelect,
   } = getInitialParams(datasetParams, type);

  const [selected, setSelected] = useState<Selected>({
    selectedKey: null,
    selectedType: null,
  });

  useEffect(() => {
    if (!selectable) {
        setSelected({
            selectedKey: null,
            selectedType: null,
        })
    }
  }, [selectable, setSelected])

  const clickEvent = (key: string, type: 'label' | 'value', dom: any) => {
    setSelected({ selectedKey: key, selectedType: type,  });
    onSelect && onSelect({ key, type, style: getInitialStyle(dom) });
  }

  if (!source?.length) return null;

  const dataTarget = data?.target || [];
  const newData = source.map((item: any, index: number) => {
    return [dataTarget[index]?.key, ...item];
  });

  return isCardAverage ? (
    <Average data={newData} datasetParams={datasetParams} {...otherProps} selected={selected} clickEvent={clickEvent} />
  ) : (
    <Basic data={newData} datasetParams={datasetParams} {...otherProps} selected={selected} clickEvent={clickEvent} />
  )
};

export default Card;
