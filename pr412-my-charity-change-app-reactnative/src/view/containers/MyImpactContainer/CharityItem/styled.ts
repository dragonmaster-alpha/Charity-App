import styled from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';

export const Container = styled(Box).attrs(({ theme }) => ({
  height: 80,
  br: 4,
  row: true,
  align: 'center',
  spaceBetween: true,
  bg: theme.colors.mainText,
  p: '10px',
  m: `${moderateScale(2, 0.5)}px`,
  width: 'auto',
}))``;

export const RightBlock = styled(Box).attrs({
  row: true,
  align: 'center',
  flex: 3,
})``;

export const LogoBlock = styled(Box).attrs({
  width: 60,
  height: 70,
  mr: `${moderateScale(15, 0.5)}px`,
})``;

export const StyledImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 60;
  height: 70;
`;

export const CharityNameBlock = styled(Box).attrs({
  width: '63%',
})``;

export const CharityName = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.secondaryText,
  size: '14',
  numberOfLines: 1,
  ellipsizeMode: 'tail',
}))``;

export const LeftBlock = styled(Box).attrs({
  align: 'flex-end',
  flex: 1,
})``;

export const DonatedBlock = styled(Box).attrs(({ theme }) => ({
  width: 'auto',
  bg: theme.colors.main,
  br: 15,
  mb: 6,
}))``;

export const DonatedValue = styled(Text).attrs({
  size: 14,
  weight: 'bold',
  m: `${moderateScale(4, 0.5)}px ${moderateScale(8, 0.5)}px`,
})``;

export const Description = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.main,
}))``;
