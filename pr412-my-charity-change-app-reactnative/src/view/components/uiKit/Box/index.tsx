import styled, { css } from 'styled-components';

import { BoxProps } from './types';

const getJustifyContent = (props: BoxProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'center')) return 'center';
  if (Object.prototype.hasOwnProperty.call(props, 'spaceBetween')) return 'space-between';
  if (Object.prototype.hasOwnProperty.call(props, 'spaceAround')) return 'space-around';
  if (Object.prototype.hasOwnProperty.call(props, 'flexEnd')) return 'flex-end';
  return 'flex-start';
};

export const Box = styled.View<BoxProps>`
  ${(props: BoxProps) => css`
    width: ${props.width || '100%'};
    height: ${props.height || 'auto'};
    ${props.mh ? `max-height: ${props.mh}` : ''};
    
    flex-direction: ${props.row ? 'row' : 'column'};
    flex-wrap: ${props.wrap ? 'wrap' : 'nowrap'};
    justify-content: ${props.justify || getJustifyContent(props)};
    align-items: ${props.align || 'flex-start'};
    ${props.flex ? `flex: ${props.flex}` : ''};
    
    margin: ${props.m || 0};
    ${props.ml ? `margin-left: ${props.ml};` : ''}
    ${props.mr ? `margin-right: ${props.mr};` : ''}
    ${props.mt ? `margin-top: ${props.mt};` : ''}
    ${props.mb ? `margin-bottom: ${props.mb};` : ''}
    
    padding: ${props.p || 0};
    ${props.pv ? `padding-vertical: ${props.pv};` : ''}
    ${props.pl ? `padding-left: ${props.pl};` : ''}
    ${props.pr ? `padding-right: ${props.pr};` : ''}
    ${props.ph ? `padding-horizontal: ${props.ph};` : ''}
    ${props.pt ? `padding-top: ${props.pt};` : ''}
    ${props.pb ? `padding-bottom: ${props.pb};` : ''}
    
    background: ${props.bg || 'transparent'};
    opacity: ${props.opacity || 1};
    border-radius: ${props.br || 0};
    ${props.border ? `border: ${props.border};` : ''}
  `}
`;
