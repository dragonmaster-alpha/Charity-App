/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TextInputProps } from 'react-native';

import { Container, SearchIcon, StyledInput } from './styled';

export const SearchInput: React.FC<TextInputProps> = (
  { value, placeholder = 'Search all charities', onChangeText },
  ...props
) => (
  <Container>
    <SearchIcon isSelected={( value || [] ).length > 0} />
    <StyledInput placeholder={placeholder} onChangeText={onChangeText} {...props} />
  </Container>
);
