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
  label: 'Save',
  height: 50,
  size: '14',
})``;
