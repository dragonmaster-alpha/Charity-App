import styled from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';

export const DayBlock = styled(Box).attrs({
  row: true,
  center: true,
  pb: `${moderateScale(16, 0.5)}px`,
})`
  position: relative;
`;

export const HorizontalView = styled(Box).attrs({})`
  position: absolute;
  top: 9;
  border-color: ${({ theme }) => theme.colors.horizontalView};
  border-width: 1;
`;

export const DayNameBlock = styled(Box).attrs(({ theme }) => ({
  width: 'auto',
  bg: theme.colors.mainText,
  p: '0px 10px',
}))``;

export const DayName = styled(Text).attrs(({ theme }) => ({
  size: 21,
  lh: 21,
  color: theme.colors.secondaryText,
}))``;

export const FeedInfoBlock = styled(Box).attrs({
  width: 'auto',
  align: 'center',
  row: true,
  spaceBetween: true,
  pb: `${moderateScale(10, 0.5)}px`,
})``;

export const NamePriceBlock = styled(Box).attrs({
  width: 'auto',
  align: 'center',
  row: true,
})``;

export const FeedIconBlock = styled(Box).attrs(({ theme }) => ({
  width: 48,
  height: 43,
  align: 'center',
  center: true,
  mr: `${moderateScale(10, 0.5)}px`,
  br: 4,
  bg: theme.colors.secondaryBackground,
}))``;

export const FeedName = styled(Text).attrs(({ theme }) => ({
  size: 14,
  color: theme.colors.secondaryText,
  numberOfLines: 1,
  ellipsizeMode: 'tail',
}))``;

export const FeedPrice = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.feedPrice,
}))``;

export const FeedAdded = styled(Text).attrs(({ theme }) => ({
  size: 16,
  color: theme.colors.main,
}))``;
