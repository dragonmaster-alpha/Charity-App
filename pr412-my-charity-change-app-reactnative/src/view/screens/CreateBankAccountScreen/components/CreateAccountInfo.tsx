/* eslint-disable no-console */
import React from 'react';
import { View } from 'react-native';

import { Loader } from 'view/components/uiKit/Loader';

import {
  InfoBlock,
  LoaderBlock,
  InfoTextBlock,
  InfoText,
  StepBlock,
  StepText,
  StepIcon,
} from '../styled';

interface Props {
  color: string;
}

export const CreateAccountInfo: React.FC<Props> = React.memo(({ color }) => (
  <InfoBlock>
    <LoaderBlock>
      <Loader reverse size={30} />
    </LoaderBlock>
    <InfoTextBlock>
      <InfoText mb={30}>Linking your account, this may take a minute or two.</InfoText>
      <InfoText>We’ll notify you if you leave the app.</InfoText>
    </InfoTextBlock>
    <View>
      <StepBlock mb={20}>
        <StepIcon />
        <StepText>Securing connection</StepText>
      </StepBlock>
      <StepBlock mb={20}>
        <StepIcon style={{ tintColor: color }} />
        <StepText>Logging in</StepText>
      </StepBlock>
      <StepBlock>
        <StepIcon style={{ tintColor: '#858585' }} />
        <StepText>Retrieving your info</StepText>
      </StepBlock>
    </View>
  </InfoBlock>
));
