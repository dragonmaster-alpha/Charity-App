import styled from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

import { statusBarHeight } from 'utils/helpers';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';

export const Container = styled(Box).attrs(({ theme }) => ({
  flex: 1,
  bg: theme.colors.scanBackground,
}))``;

//  header
export const Header = styled(Box).attrs({
  p: `${statusBarHeight + moderateScale(20, 0.5)}px ${moderateScale(16, 0.5)}px ${moderateScale(
    40,
    0.5,
  )}px`,
})`
  position: relative;
`;

export const TopHeaderBlock = styled(Box).attrs({
  row: true,
  align: 'center',
  center: true,
})`
  position: relative;
`;

export const GoBackBlock = styled.TouchableOpacity`
  width: 60;
  height: 100%;
  position: absolute;
  left: 0;
  justify-content: center;
`;

export const GoBackIcon = styled.Image.attrs({
  source: require('assets/img/backIcon.png'),
})`
  width: 24;
  height: 24;
`;

export const Title = styled(Text).attrs({
  center: true,
  size: 30,
  lh: 40,
})``;

export const CameraBlockedContainer = styled(Box).attrs({
  align: 'center',
  p: '16px',
})``;

export const CameraBlockedText = styled(Text).attrs({
  center: true,
  size: 14,
  mb: 20,
})``;
