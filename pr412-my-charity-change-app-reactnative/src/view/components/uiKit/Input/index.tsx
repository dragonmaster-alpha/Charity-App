/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { ThemeContext } from 'styled-components';

import { InputProps } from './types';

import {
  Label,
  InputContainer,
  InputWrapper,
  LeftInputIcon,
  LeftInputPart,
  TooltipBlock,
  StyledTooltip,
  IconOpenTooltip,
  TooltipInfoBlock,
  TooltipInfoIcon,
  TooltipInfoText,
  StyledInput,
  StyledMaskedInput,
  RightIconBlock,
  RightIcon,
  ErrorText,
} from './styled';

export const Input: React.FC<InputProps> = ({
  label,
  error,
  type,
  isTooltip,
  isTooltipVisible,
  sourceRightIcon,
  sourceTooltipRightIcon,
  sourceLeftIcon,
  handleIconPress,
  onClose,
  inputRef,
  rightComponent,
  autoCapitalize,
  ...inputProps
}) => {
  const theme = useContext(ThemeContext);
  const errorText = () => {
    if (error && error.length > 0) {
      return <ErrorText>{error}</ErrorText>;
    }
    return null;
  };

  const tooltipContent = () => (
    <TooltipInfoBlock>
      <TooltipInfoIcon />
      <TooltipInfoText>The three-digit number on the back of your card</TooltipInfoText>
    </TooltipInfoBlock>
  );

  return (
    <>
      {label && <Label>{label}</Label>}
      <InputContainer error={error}>
        <InputWrapper>
          <LeftInputPart>
            {sourceLeftIcon && (
              <LeftInputIcon
                source={sourceLeftIcon}
                style={{
                  tintColor: error && error.length > 0 ? theme.colors.errorIcon : 'black',
                }}
              />
            )}
            {type ? (
              <StyledMaskedInput type={type} {...inputProps} />
            ) : (
              <StyledInput
                underlineColorAndroid="transparent"
                autoCapitalize={autoCapitalize || 'none'}
                autoCorrect={false}
                placeholderTextColor={theme.colors.feedPrice}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={(input: any) => inputRef && inputRef(input)}
                {...inputProps}
              />
            )}
          </LeftInputPart>
          {isTooltip && (
            <TooltipBlock>
              <StyledTooltip
                isVisible={isTooltipVisible}
                content={tooltipContent()}
                onClose={onClose}
              >
                <TouchableWithoutFeedback onPress={handleIconPress}>
                  <IconOpenTooltip source={sourceTooltipRightIcon} />
                </TouchableWithoutFeedback>
              </StyledTooltip>
            </TooltipBlock>
          )}
          {sourceRightIcon && (
            <RightIconBlock>
              <TouchableOpacity onPress={handleIconPress}>
                <RightIcon source={sourceRightIcon} />
              </TouchableOpacity>
            </RightIconBlock>
          )}
        </InputWrapper>
        {rightComponent}
      </InputContainer>
      {errorText()}
    </>
  );
};
