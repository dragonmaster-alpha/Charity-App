import React from 'react';
import { moderateScale } from 'react-native-size-matters';

import { Box } from 'view/components/uiKit/Box';
import { Text } from 'view/components/uiKit/Text';

interface DonationComponentProps {
  price?: string | number;
  description: string;
  isMargin?: boolean;
}

export const DonationComponent = ({ price, description, isMargin }: DonationComponentProps) => (
  <Box
    bg="#fff"
    br={4}
    flex={1}
    mr={isMargin ? moderateScale(9, 0.5) : 0}
    p={`${moderateScale(16, 0.5)}px`}
    pr="0px"
  >
    <Text color="#1F3961" size="20">
      {`$${price}`}
    </Text>
    <Text color="#1D65BC" size={moderateScale(14, 0.5)} weight="regular">
      {description}
    </Text>
  </Box>
);
