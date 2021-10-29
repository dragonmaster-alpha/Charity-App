import { moderateScale } from 'react-native-size-matters';
import styled, { css } from 'styled-components';
import { TextInputMask } from 'react-native-masked-text';
import Tooltip from 'react-native-walkthrough-tooltip';

import { Text } from '../Text';
import { Box } from '../Box';

interface ContainerProps {
  error?: string;
}

export const InputContainer = styled(Box).attrs<ContainerProps>(({ error, theme }) => ({
  width: '100%',
  border: `1px solid ${error ? theme.colors.error : theme.colors.inputBorder}`,
  p: `0px 0px 0px ${moderateScale(13, 0.2)}px`,
  row: true,
  align: 'center',
  br: 4,
}))``;

export const InputWrapper = styled(Box).attrs({
  row: true,
  align: 'center',
  flex: 1,
  spaceBetween: true,
})``;

export const LeftInputPart = styled(Box).attrs({
  row: true,
  align: 'center',
  width: 'auto',
  flex: 2,
})``;

export const LeftInputIcon = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 16;
  height: 16;
  margin-right: ${moderateScale(8, 0.2)}px;
`;

export const TooltipBlock = styled(Box).attrs({
  align: 'flex-end',
  flex: 1,
})``;

export const StyledTooltip = styled(Tooltip).attrs(({ theme }) => ({
  animated: true,
  arrowSize: {
    width: 8,
    height: 9,
  },
  backgroundColor: 'none',
  displayInsets: {
    left: 16,
    right: 16,
  },
  placement: 'bottom',
  childContentSpacing: 20,
  contentStyle: {
    width: '100%',
  },
  tooltipStyle: {
    width: '100%',
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
}))``;

export const IconOpenTooltip = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 16;
  height: 16;
  margin-right: ${moderateScale(6, 0.2)}px;
`;

export const TooltipInfoBlock = styled(Box).attrs({
  width: '100%',
  align: 'center',
  row: true,
})``;

export const TooltipInfoIcon = styled.Image.attrs({
  resizeMode: 'contain',
  source: require('assets/img/infoIcon.png'),
})`
  width: 16;
  height: 16;
  margin-right: ${moderateScale(8, 0.2)}px;
  tint-color: ${({ theme }) => theme.colors.main};
`;

export const TooltipInfoText = styled(Text).attrs(({ theme }) => ({
  width: 'auto',
  color: theme.colors.dark,
}))``;

export const Label = styled(Text).attrs(({ theme }) => ({
  width: '100%',
  color: theme.colors.feedPrice,
  size: moderateScale(14, 0.2),
  mb: moderateScale(10, 0.2),
  weight: 'regular',
}))``;

const inputCss = css`
  width: 100%;
  height: 100%;
  padding: ${moderateScale(16, 0.2)}px;
  padding-right: ${moderateScale(5, 0.2)}px;
  padding-left: 0;
  font-size: ${moderateScale(14, 0.2)};
  font-family: ${({ theme }) => theme.defaultFontFamily};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

export const StyledInput = styled.TextInput`
  ${inputCss};
`;

export const StyledMaskedInput = styled(TextInputMask)`
  ${inputCss};
`;

export const RightIconBlock = styled(Box).attrs({
  flex: 1,
  align: 'flex-end',
})``;

export const RightIcon = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 16;
  height: 16;
  margin-right: ${moderateScale(8, 0.2)}px;
`;

export const ErrorText = styled(Text).attrs(({ theme }) => ({
  width: '100%',
  size: 14,
  lh: 18,
  color: theme.colors.error,
  weight: 'regular',
}))`
  margin-top: 10px;
`;
