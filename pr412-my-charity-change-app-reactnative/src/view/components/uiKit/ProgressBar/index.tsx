import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

import { Box } from 'view/components/uiKit/Box';

interface ProgressBarProps {
  progressValue?: string | number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progressValue }) => {
  const theme = useContext(ThemeContext);
  return (
    <Box height={8} br={30} bg={theme.colors.background}>
      <Box height={8} br={30} bg={theme.colors.mainText} width={progressValue} />
    </Box>
  );
};
