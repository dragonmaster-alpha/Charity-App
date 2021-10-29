/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import { BallIndicator } from 'react-native-indicators';
import { ThemeContext } from 'styled-components';

import { Box } from '../Box';

interface LoaderProps {
  reverse?: boolean;
  size?: number;
}
export const Loader = ({ reverse, ...restProps }: LoaderProps) => {
  const theme = useContext(ThemeContext);
  return (
    <Box align="center" width="100%" height="100%">
      <BallIndicator
        color={reverse ? theme.colors.mainText : theme.colors.main}
        animationDuration={800}
        {...restProps}
      />
    </Box>
  );
};
