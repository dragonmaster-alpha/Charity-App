/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { Loader } from 'view/components/uiKit/Loader';
import { ButtonProps } from './types';

import { StyledButton, ButtonLabel } from './styled';

export const Button: React.FC<ButtonProps> = ({
  label,
  loading,
  reverseLoader,
  disabled,
  onPress,
  ...restProps
}) => (
  <StyledButton onPress={!disabled ? onPress : null} disabled={disabled} {...restProps}>
    {loading ? (
      <Loader reverse={reverseLoader} size={20} />
    ) : (
      <ButtonLabel {...restProps}>{label}</ButtonLabel>
    )}
  </StyledButton>
);
