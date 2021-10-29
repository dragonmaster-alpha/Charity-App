import styled from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

import { bottomSpace, statusBarHeight } from 'utils/helpers';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';
import { Button } from 'view/components/uiKit/Button';

export const Container = styled(Box).attrs({
  flex: 1,
})``;

//  header
export const Header = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.main,
  p: `${statusBarHeight + moderateScale(20, 0.5)}px ${moderateScale(16, 0.5)}px ${moderateScale(
    16,
    0.5,
  )}px`,
}))``;

export const TopHeaderBlock = styled(Box).attrs(({ showFullList }: boolean) => ({
  pb: showFullList ? `${moderateScale(16, 0.5)}px` : 0,
}))``;

export const Title = styled(Text).attrs({
  size: 28,
  weight: 'bold',
})``;

export const BottomHeaderBlock = styled(Box).attrs({
  row: true,
  align: 'center',
  spaceBetween: true,
})``;

// mainBlock
export const MainBlock = styled(Box).attrs({
  p: `${moderateScale(16, 0.2)}px ${moderateScale(16, 0.5)}px ${bottomSpace ||
    moderateScale(16, 0.5)}px`,
  flex: 1,
})``;

export const TopFlatListBlock = styled(Box).attrs({
  mb: 66,
})``;

export const FlatListBlock = styled(Box).attrs({
  mb: 10,
})``;

export const ButtonWrapper = styled(Box).attrs({
  mt: 'auto',
})``;

export const StyledButton = styled(Button).attrs({
  label: 'See more banks',
  height: 50,
  size: '14',
})``;

// flatlist
export const ContainerList = styled(Box).attrs(({ theme }) => ({
  height: 80,
  br: 4,
  row: true,
  align: 'center',
  spaceBetween: true,
  bg: theme.colors.mainText,
  p: '10px',
  m: `${moderateScale(5, 0.2)}px`,
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
  width: '72%',
})``;

export const CharityName = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.secondaryText,
  size: '14',
}))``;

export const ContainerTopList = styled(Box).attrs(({ theme }) => ({
  height: 160,
  br: 4,
  align: 'center',
  center: true,
  bg: theme.colors.mainText,
  p: '10px',
  m: `${moderateScale(5, 0.2)}px`,
  width: 'auto',
}))``;

export const TopLogoBlock = styled(Box).attrs({
  width: '100%',
  height: '100%',
  align: 'center',
  center: true,
  mr: `${moderateScale(15, 0.5)}px`,
})``;

export const TopStyledImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 100%;
  height: 100%;
`;

// error
export const ErrorBlock = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.errorBackground,
  br: 4,
  center: true,
  align: 'center',
  p: '9px',
  mb: 16,
}))``;

export const ErrorTitlte = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.error,
}))``;
