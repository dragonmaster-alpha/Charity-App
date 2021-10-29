/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextInputMaskProps } from 'react-native-masked-text';
import { ImageSourcePropType } from 'react-native';

export type InputProps = Partial<TextInputMaskProps> & {
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  maxLength?: string | number;
  textContentType?: string;
  returnKeyType?: string;
  placeholder: string;
  keyboardType?: string;
  autoCompleteType?: string;
  onChangeText: any;
  value: string;
  type?: string;
  sourceRightIcon?: ImageSourcePropType;
  sourceLeftIcon?: ImageSourcePropType;
  isTooltip?: boolean;
  isTooltipVisible?: boolean;
  handleIconPress?: any;
  handleTooltipIconPress?: any;
  sourceTooltipRightIcon?: ImageSourcePropType;
  onClose?: any;
  inputRef?: any;
  rightComponent?: JSX.Element;
};
