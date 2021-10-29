import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';

import { Text } from '../Text';
import { Box } from '../Box';

export const StyledTouchable = styled.TouchableWithoutFeedback`
  width: 100%;
  height: 100%;
`;

export const CheckboxWrapper = styled(Box).attrs({
  width: '100%',
  height: '100%',
  row: true,
  align: 'center',
  spaceBetween: true,
})``;

export const RightBlock = styled(Box).attrs({
  row: true,
  align: 'center',
  flex: 9,
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

export const CheckImageWrapper = styled(Box).attrs(({ theme }) => ({
  width: 32,
  height: 32,
  align: 'center',
  center: true,
  br: 50,
  bg: theme.colors.main,
}))``;

export const StyledCheckImage = styled.Image.attrs({
  resizeMode: 'contain',
  source: require('assets/img/checkIcon.png'),
})`
  width: 11;
  height: 8;
`;

export const NotCheckingWrapper = styled(Box).attrs(({ theme }) => ({
  width: 32,
  height: 32,
  br: 50,
  border: `1px solid ${theme.colors.horizontalView}`,
}))``;
