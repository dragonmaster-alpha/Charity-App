import styled from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

import { bottomSpace, isIOS } from 'utils/helpers';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';
import { Button } from 'view/components/uiKit/Button';

export const Container = styled(Box).attrs({
  flex: 1,
})``;

//  header
export const Header = styled(Box).attrs(({ theme, isEditViewScreen }) => ({
  bg: theme.colors.main,
  p: `${
    isEditViewScreen ? moderateScale(isIOS ? 40 : 25, 0.5) : moderateScale(isIOS ? 60 : 35, 0.5)
  }px ${moderateScale(16, 0.5)}px ${moderateScale(16, 0.5)}px`,
}))``;

export const TopHeaderBlock = styled(Box).attrs({
  pb: `${moderateScale(16, 0.5)}px`,
})``;

export const GoBackBlock = styled.TouchableOpacity`
  width: 60;
  height: 24;
  margin-bottom: ${moderateScale(20, 0.2)}px;
  justify-content: center;
`;

export const GoBackIcon = styled.Image.attrs({
  source: require('assets/img/backIcon.png'),
})`
  width: 24;
  height: 24;
`;

export const Title = styled(Text).attrs({
  size: 28,
  weight: 'bold',
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})``;

export const BottomHeaderBlock = styled(Box).attrs({
  row: true,
  align: 'center',
  spaceBetween: true,
  mb: `${moderateScale(16, 0.2)}px`,
})``;

// mainBlock
export const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView.attrs({
  behavior: isIOS ? 'padding' : 'height',
  enabled: true,
})`
  width: 100%;
  flex: 1;
`;

export const MainBlock = styled(Box).attrs({
  p: `${moderateScale(16, 0.5)}px ${moderateScale(16, 0.5)}px ${bottomSpace ||
    moderateScale(16, 0.5)}px`,
  flex: 1,
})``;

// error block
export const ErrorBlock = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.errorBackground,
  br: 4,
  center: true,
  align: 'center',
  p: '9px',
  mb: 10,
}))``;

export const ErrorTitlte = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.error,
  center: true,
}))``;

export const FlatListBlock = styled(Box).attrs(({ isShowInfo }) => ({
  mb: isShowInfo ? 100 : 70,
}))``;

export const ButtonWrapper = styled(Box).attrs({
  mt: 'auto',
})``;

export const StyledButton = styled(Button).attrs({
  height: 50,
  size: '14',
})``;

export const ContainerList = styled(Box).attrs(({ theme }) => ({
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
