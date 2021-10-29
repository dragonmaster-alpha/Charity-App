export interface ButtonProps {
  width?: string | number;
  height?: string | number;
  flex?: string | number;
  reverse?: boolean;
  label: string;
  onPress?: any;
  disabled?: boolean;
  bg?: string;
  size?: string;
  weight?: string;
  color?: string | boolean;
  loading?: boolean;
  reverseLoader?: boolean;
}
