import styled from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';
import { Button } from 'view/components/uiKit/Button';

export const Container = styled(Box).attrs(({ theme }) => ({
  flex: 1,
  bg: theme.colors.mainText,
}))``;

//  header
export const Header = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.main,
  p: `${moderateScale(16, 0.5)}px`,
}))``;

export const TopHeaderBlock = styled(Box).attrs({
  row: true,
  align: 'center',
  spaceBetween: true,
  pb: `${moderateScale(16, 0.5)}px`,
})``;

export const UserNameBlock = styled(Box).attrs({
  flex: 2,
  pr: '3px',
})``;

export const UserName = styled(Text).attrs({
  size: 28,
  weight: 'bold',
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})``;

export const ProfileViewBlock = styled(Box).attrs({
  width: 'auto',
})``;

export const ProfileViewButton = styled(Button).attrs(({ theme }) => ({
  label: 'Profile settings',
  bg: theme.colors.background,
  size: '12',
  height: '36',
  width: '100%',
}))``;

export const BottomHeaderBlock = styled(Box).attrs({
  row: true,
  align: 'center',
  spaceBetween: true,
})``;

// mainBlock
export const MainBlock = styled(Box).attrs({
  p: `${moderateScale(14, 0.5)}px`,
  flex: 1,
  mb: `${moderateScale(10, 0.5)}px`,
})``;

export const FlatListBlock = styled(Box).attrs({
  mb: 70,
})``;

export const EditCharitiesBlock = styled(Box).attrs({
  mt: 'auto',
})``;

export const EditCharitiesButton = styled(Button).attrs({
  label: 'Add / Edit Charities',
  size: '14',
  height: '50',
  width: '100%',
  weight: 'bold',
})``;

export const ErrorBlock = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.errorBackground,
  br: 4,
  center: true,
  align: 'center',
  p: '9px',
}))``;

export const ErrorTitlte = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.error,
  center: true,
}))``;
