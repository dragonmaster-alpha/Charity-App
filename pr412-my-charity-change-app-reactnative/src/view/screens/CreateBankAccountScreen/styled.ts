/* eslint-disable no-unused-vars */
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
export const Header = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.main,
  p: `${moderateScale(isIOS ? 40 : 25, 0.5)}px ${moderateScale(16, 0.5)}px ${moderateScale(
    16,
    0.5,
  )}px`,
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

export const Title = styled(Text).attrs({
  size: 28,
  weight: 'bold',
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

export const StyledScrollView = styled.ScrollView.attrs({
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
})`
  width: 100%;
  flex: 1;
  margin-bottom: 15;
`;

export const InputWrapper = styled(Box).attrs({
  mb: 12,
})``;

export const PaymentDetailsBlock = styled(Box).attrs({
  p: '14px 0px',
})`
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.colors.horizontalView};
  border-bottom-width: 1;
  border-bottom-color: ${({ theme }) => theme.colors.horizontalView};
`;

export const GoToPaymentDetails = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PaymentInfoBlock = styled(Box).attrs({
  width: 'auto',
  align: 'center',
  row: true,
})``;

export const StyledCardImage = styled.Image.attrs({
  source: require('assets/img/feedIcon.png'),
})`
  width: 15;
  height: 11;
`;

export const FeedIconBlock = styled(Box).attrs(({ theme }) => ({
  width: 32,
  height: 32,
  align: 'center',
  center: true,
  mr: `${moderateScale(10, 0.5)}px`,
  br: 50,
  bg: theme.colors.secondaryBackground,
}))``;

export const PaymentInfoWrapper = styled(Box).attrs({
  width: 'auto',
})``;

export const PaymentTitle = styled(Text).attrs(({ theme }) => ({
  size: 14,
  color: theme.colors.secondaryText,
  mb: 4,
}))``;

export const PaymentInfo = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.cardInfo,
  weight: 'regular',
}))``;

export const StyledNextIcon = styled.Image.attrs({
  source: require('assets/img/nextIcon.png'),
})`
  width: 16;
  height: 16;
`;

export const ButtonWrapper = styled(Box).attrs({
  mt: 'auto',
})``;

export const StyledButton = styled(Button).attrs({
  label: 'Securely Link Account',
  height: 50,
  size: '14',
})``;

// error
export const ErrorBlock = styled(Box).attrs(({ theme }) => ({
  bg: theme.colors.errorBackground,
  br: 4,
  center: true,
  align: 'center',
  p: '9px',
}))``;

export const ErrorTitlte = styled(Text).attrs(({ theme }) => ({
  color: theme.colors.error,
}))``;

// create bank account info view
export const InfoBlock = styled(Box).attrs(({ theme }) => ({
  height: '100%',
  bg: 'rgba(0, 0, 0, 0.8)',
  position: 'absolute',
  center: true,
  align: 'center',
}))``;

export const LoaderBlock = styled(Box).attrs({
  height: '30px',
  mb: 20,
})``;

export const InfoTextBlock = styled(Box).attrs({
  mb: 45,
  p: '0px 40px',
  align: 'center',
})``;

export const InfoText = styled(Text).attrs(({ theme }) => ({
  size: 20,
  lh: 25,
  center: true,
}))``;

export const StepBlock = styled(Box).attrs({
  row: true,
  align: 'center',
})``;

export const StepText = styled(Text).attrs(({ theme }) => ({
  size: 16,
  lh: 20,
}))``;

export const StepIcon = styled.Image.attrs({
  source: require('assets/img/checkCreateBank.png'),
})`
  width: 18;
  height: 18;
  margin-right: 10;
`;
