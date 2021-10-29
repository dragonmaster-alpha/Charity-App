import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';

import { config } from 'config';
import { Navigation, RootState } from 'types';

import {
  Container,
  Header,
  GoBackBlock,
  GoBackIcon,
  TopHeaderBlock,
  Title,
  ContentTitle,
  StyledContentContainer,
  ContinueButton,
  ContinueWrapper,
} from './styled';

interface Props {
  navigation: Navigation;
}

export const WaitingActionScreen: React.FC<Props> = ({ navigation }) => {
  const goBack = useCallback(() => navigation.goBack(), []);

  const { userId, userToken } = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    if (!!navigation.state.params && !!navigation.state.params.onStart) {
      navigation.state.params.onStart();
    }
  }, [navigation]);

  const isBackAllowed = !!navigation.state.params && !!navigation.state.params.isBackAllowed;

  const title =
    !!navigation.state.params &&
    !!navigation.state.params.title &&
    navigation.state.params.title.length > 0
      ? navigation.state.params.title
      : '';

  const handleContinueCreateAccount = useCallback(() => {
    Linking.openURL(`${config.WEBSITE_URI}connect-account?user-id=${userId}&token=${userToken}`);
  }, [userToken, userId]);

  return (
    <Container>
      <Header>
        {isBackAllowed && (
          <GoBackBlock onPress={goBack}>
            <GoBackIcon />
          </GoBackBlock>
        )}
        <TopHeaderBlock>
          <Title>{title}</Title>
        </TopHeaderBlock>
      </Header>
      <StyledContentContainer>
        <ContentTitle>Waiting for web action...</ContentTitle>
        <ContinueWrapper>
          <ContinueButton onPress={handleContinueCreateAccount} />
        </ContinueWrapper>
      </StyledContentContainer>
    </Container>
  );
};
