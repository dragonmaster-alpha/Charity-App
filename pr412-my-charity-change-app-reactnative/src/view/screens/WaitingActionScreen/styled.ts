import { View } from 'react-native';
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

export const TopHeaderBlock = styled(Box).attrs({
  row: true,
  align: 'center',
  spaceBetween: true,
})``;

export const Title = styled(Text).attrs({
  size: 28,
  weight: 'bold',
})``;

export const ContentTitle = styled(Title).attrs(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.notActive,
}))``;

export const ContinueWrapper = styled(Box).attrs({
  p: '10px 20px',
  width: '100%',
})``;

export const ContinueButton = styled(Button).attrs({
  label: 'Continue creating an account',
  height: 50,
  size: '14',
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

export const InputWrapper = styled(Box).attrs({
  mb: 12,
})``;

export const ButtonWrapper = styled(Box).attrs({
  mt: 'auto',
  align: 'center',
})``;

export const StyledButton = styled(Button).attrs({
  height: 50,
  size: '14',
})``;

export const StyledContentContainer = styled(View).attrs({
  flex: 1,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})``;
