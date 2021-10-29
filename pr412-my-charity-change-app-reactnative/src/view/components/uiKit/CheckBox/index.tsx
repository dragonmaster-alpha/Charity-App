/* eslint-disable no-else-return */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import {
  StyledTouchable,
  CheckboxWrapper,
  RightBlock,
  LogoBlock,
  StyledImage,
  CharityNameBlock,
  CharityName,
  LeftBlock,
  CheckImageWrapper,
  StyledCheckImage,
  NotCheckingWrapper,
} from './styled';

export const CheckBox = ({ value, label, item, checkSelected, clicked, notSelected }: any) => {
  const [isCheck, setChecked] = useState(false);

  useEffect(() => {
    const newCheck = checkSelected.map((i: { label: number }) => i.label);
    newCheck.map((i: number) => {
      if (i === label) {
        setChecked(true);
      }
    });
  }, [checkSelected]);

  const checkClicked = () => {
    if (checkSelected.length === 3 && !isCheck) {
      return null;
    } else {
      setChecked(!isCheck);
      clicked && clicked(value, label, isCheck);
    }
  };

  return (
    <StyledTouchable onPress={checkClicked}>
      <CheckboxWrapper
        style={{
          opacity: checkSelected.length === 3 && !isCheck ? 0.5 : 1,
        }}
      >
        <RightBlock>
          <LogoBlock>{item.logo && <StyledImage source={{ uri: item.logo }} />}</LogoBlock>
          <CharityNameBlock>
            <CharityName>{item.name}</CharityName>
          </CharityNameBlock>
        </RightBlock>
        <LeftBlock>
          {isCheck ? (
            <CheckImageWrapper>
              <StyledCheckImage />
            </CheckImageWrapper>
          ) : (
            <NotCheckingWrapper />
          )}
        </LeftBlock>
      </CheckboxWrapper>
    </StyledTouchable>
  );
};
