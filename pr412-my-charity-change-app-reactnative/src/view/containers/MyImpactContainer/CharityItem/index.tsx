import React from 'react';
import { ImageSourcePropType } from 'react-native';

import {
  Container,
  RightBlock,
  LogoBlock,
  StyledImage,
  CharityNameBlock,
  CharityName,
  LeftBlock,
  DonatedBlock,
  DonatedValue,
  Description,
} from './styled';

interface ListProps {
  logo: ImageSourcePropType;
  name: string;
  total_charity_amount: string;
}

interface CharityItemProps {
  item: ListProps;
}

export const CharityItem = ({ item }: CharityItemProps) => (
  <Container
    style={{
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    }}
  >
    <RightBlock>
      <LogoBlock>{item.logo && <StyledImage source={{ uri: item.logo }} />}</LogoBlock>
      <CharityNameBlock>
        <CharityName>{item.name}</CharityName>
      </CharityNameBlock>
    </RightBlock>
    <LeftBlock>
      <DonatedBlock>
        <DonatedValue>{`$${item.total_charity_amount}`}</DonatedValue>
      </DonatedBlock>
      <Description>donated</Description>
    </LeftBlock>
  </Container>
);
