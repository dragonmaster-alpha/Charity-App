export interface TextProps {
  width?: string | number;
  size?: string | number;
  lh?: string | number;
  ls?: string | number;
  color?: string;
  transform?: string;
  decoration?: string;
  opacity?: number;

  m?: string | number;
  mt?: string | number;
  mb?: string | number;
  mr?: string | number;
  ml?: string | number;

  center?: boolean;
  right?: boolean;
  left?: boolean;
  italic?: boolean;
  weight?: 'thin' | 'light' | 'regular' | 'semiBold' | 'bold' | 'extraBold';
}
