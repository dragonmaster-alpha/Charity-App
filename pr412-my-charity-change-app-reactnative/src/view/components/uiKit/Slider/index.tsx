/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { StyledSlider } from './styled';

interface SliderProps {
  minimumValue?: number;
  maximumValue?: number;
  value: number;
  onValueChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ ...restProps }) => <StyledSlider {...restProps} />;
