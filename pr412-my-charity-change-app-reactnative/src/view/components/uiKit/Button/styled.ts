import styled, { css } from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

import { Text } from 'view/components/uiKit/Text';

import { ButtonProps } from './types';

export const StyledButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})<Partial<ButtonProps>>`
  ${({ theme, ...props }) => css`
    width: ${props.width || '100%'};
    height: ${props.height || moderateScale(45, 0.2)};
    background-color: ${props.disabled ? theme.colors.inputBorder : props.bg || theme.colors.main};
  `};
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding-horizontal: ${moderateScale(16, 0.2)}px;
`;

export const ButtonLabel = styled(Text).attrs(({ size, lh, color }) => ({
  size: size || moderateScale(12, 0.2),
  lh: lh || moderateScale(16, 0.2),
  center: true,
  color,
}))``;
