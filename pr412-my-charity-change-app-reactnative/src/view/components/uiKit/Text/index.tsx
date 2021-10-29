import styled, { css } from 'styled-components';
import { defaultScale } from 'utils/helpers';

import { TextProps } from './types';

const fontWeightToName = {
  thin: 'Thin',
  light: 'Light',
  regular: 'Regular',
  semiBold: 'Medium',
  bold: 'Bold',
  extraBold: 'Black',
};

const getFontFamily = ({ italic = false, weight = 'semiBold' }: TextProps) =>
  `Roboto-${fontWeightToName[weight]}${italic ? 'Italic' : ''}`;

const getTextAlign = (props: TextProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'center')) return 'center';
  if (Object.prototype.hasOwnProperty.call(props, 'right')) return 'right';
  return 'left';
};

export const Text = styled.Text<TextProps>`
  ${(props: TextProps) => css`
    width: ${props.width || 'auto'};
    font-size: ${props.size || defaultScale(12)};
        
    margin: ${props.m || 0};
    ${props.ml ? `margin-left: ${props.ml};` : ''}
    ${props.mr ? `margin-right: ${props.mr};` : ''}
    ${props.mt ? `margin-top: ${props.mt};` : ''}
    ${props.mb ? `margin-bottom: ${props.mb};` : ''}
    
    ${props.lh ? `line-height: ${props.lh}px` : ''};
    ${props.ls ? `letter-spacing: ${props.ls}` : ''};

    color: ${props.color || '#fff'};
    ${props.opacity ? `opacity: ${props.opacity}` : ''};
    
    text-align: ${getTextAlign(props)};
    font-family: '${getFontFamily(props)}';
`}
`;
