/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import { ItemFilterWrapper, FilterTitle } from './styled';

export const FilterCheckbox = ({ label, checkSelected, filterItem, clicked }: any) => {
  const [isCheck, setChecked] = useState(false);

  useEffect(() => {
    const newCheck = checkSelected.map((i: { label: number }) => i.label);
    newCheck.map((i: string) => {
      if (i === label) {
        setChecked(true);
      }
    });
  }, [checkSelected]);

  const checkClicked = () => {
    setChecked(!isCheck);
    clicked && clicked(label, isCheck);
  };

  return (
    <TouchableOpacity onPress={checkClicked}>
      <ItemFilterWrapper isCheck={isCheck}>
        <FilterTitle key={filterItem.id} isCheck={isCheck}>
          {filterItem.name}
        </FilterTitle>
      </ItemFilterWrapper>
    </TouchableOpacity>
  );
};
