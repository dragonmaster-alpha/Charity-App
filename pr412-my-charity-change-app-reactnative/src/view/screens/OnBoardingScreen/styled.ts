import styled from 'styled-components';
import { Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Pagination } from 'react-native-snap-carousel';

import { statusBarHeight, ScreenWidth, isIOS } from 'utils/helpers';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';
import { Button } from 'view/components/uiKit/Button';

const controlsHeight = isIOS ? 140 : 170;
const { height: screenHeight } = Dimensions.get('window');

export const ScreenContainer = styled(Box).attrs(({ theme }) => ({
  width: ScreenWidth,
  height: screenHeight - controlsHeight,
  center: true,
  align: 'center',
  bg: theme.colors.main,
  ph: 16,
  pt: moderateScale(24, 1),
}))``;

export const ImageContainer = styled(Box).attrs({
  width: '100%',
  height: '100%',
  align: 'center',
  spaceBetween: true,
  pt: statusBarHeight,
})``;

export const ImageWrapper = styled(Box).attrs({
  width: '80%',
  height: '78%',
})``;

export const StyledImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 100%;
  height: 100%;
`;

export const Title = styled(Text).attrs({
  size: moderateScale(23, 0.7),
  center: true,
  width: '95%',
})`
  padding-bottom: ${moderateScale(10, 0.7)};
`;

export const SubTitle = styled(Text).attrs(({ theme }) => ({
  size: `${moderateScale(11, 0.2)}px`,
  center: true,
  color: theme.colors.progressValue,
  width: '95%',
}))``;

export const PaginationBox = styled(Box).attrs(({ theme }) => ({
  height: controlsHeight,
  width: ScreenWidth,
  align: 'center',
  bg: theme.colors.main,
  p: '0px 16px',
}))``;

export const StyledPagination = styled(Pagination).attrs(({ theme }) => ({
  dotContainerStyle: {
    marginHorizontal: 3,
  },
  dotStyle: {
    width: 9,
    height: 9,
    borderRadius: 50,
    marginHorizontal: 3,
    backgroundColor: theme.colors.mainText,
  },
  inactiveDotScale: 1,
}))``;

export const StyledButton = styled(Button).attrs(({ theme }) => ({
  size: '14px',
  bg: theme.colors.mainText,
  color: theme.colors.main,
  height: '50px',
}))``;
