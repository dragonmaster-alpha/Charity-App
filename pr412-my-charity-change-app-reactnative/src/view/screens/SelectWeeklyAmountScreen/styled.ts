import styled from 'styled-components';
import { TouchableOpacity, Image } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { bottomSpace, isIOS } from 'utils/helpers';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';
import { Button } from 'view/components/uiKit/Button';

export const Container = styled(Box).attrs({
  flex: 1,
})``;

//  header
export const Header = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.main,
  p: `${moderateScale(isIOS ? 50 : 35, 0.5)}px ${moderateScale(16, 0.5)}px ${moderateScale(
    16,
    0.5,
  )}px`,
}))``;

export const GoBackBlock = styled(TouchableOpacity)`
  width: 60;
  height: 24;
  margin-bottom: ${moderateScale(20, 0.2)}px;
  justify-content: center;
`;

export const GoBackIcon = styled(Image).attrs({
  source: require('assets/img/backIcon.png'),
})`
  width: 24;
  height: 24;
`;

export const Title = styled(Text).attrs({
  size: 28,
  weight: 'bold',
  mb: 10,
})``;

export const SubTitle = styled(Text).attrs(({ theme }) => ({
  size: 14,
  color: theme.colors.progressValue,
}))``;

// mainBlock
export const MainBlock = styled(Box).attrs({
  p: `${moderateScale(16, 0.5)}px ${moderateScale(16, 0.5)}px ${bottomSpace ||
    moderateScale(16, 0.5)}px`,
  flex: 1,
})``;

export const WeeklyGoalBlock = styled(Box).attrs({
  row: true,
  align: 'center',
  spaceBetween: true,
})``;

export const WeeklyTitle = styled(Text).attrs(({ theme }) => ({
  size: 14,
  color: theme.colors.feedPrice,
}))``;

export const WeeklyValueWrapper = styled(Box).attrs({
  align: 'center',
  center: true,
  width: '56px',
  height: '30px',
  bg: '#1D65BC',
  br: 4,
})``;

export const WeeklyValue = styled(Text).attrs({
  size: 14,
})``;

export const SliderBlock = styled.View`
  width: 100%;
`;

export const WeeklyIntervalWrapper = styled(Box).attrs({
  align: 'center',
  spaceBetween: true,
  row: true,
})``;

export const ButtonWrapper = styled(Box).attrs({
  mt: 'auto',
  align: 'center',
})``;

export const StyledButton = styled(Button).attrs({
  label: 'Save',
  height: 50,
  size: '14',
})``;

// error
export const ErrorBlock = styled(Box).attrs({
  mt: 20,
  align: 'center',
  center: true,
})``;

export const ErrorText = styled(Text).attrs({
  size: 14,
  color: '#F43428',
  width: '70%',
  center: true,
  weight: 'regular',
})``;
