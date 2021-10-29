import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';

import { Text } from '../uiKit/Text';
import { Box } from '../uiKit/Box';

export const ItemFilterWrapper = styled(Box).attrs(({ theme, isCheck }) => ({
  width: 'auto',
  bg: isCheck ? theme.colors.mainText : theme.colors.filterBackground,
  br: 4,
  mr: `${moderateScale(8, 0.2)}px`,
}))``;

export const FilterTitle = styled(Text).attrs(({ theme, isCheck }) => ({
  size: 14,
  m: '5px 10px',
  color: isCheck && theme.colors.main,
}))``;
