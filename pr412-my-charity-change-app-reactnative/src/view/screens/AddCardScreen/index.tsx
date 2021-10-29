/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Linking } from 'react-native';
import { config } from 'config';
import { encodeURIField } from 'utils/helpers';
import { useAction } from 'utils/hooks';
import { Navigation, RootState } from 'types';

import * as Actions from 'modules/card/actions';

import {
  Container,
  Header,
  GoBackBlock,
  GoBackIcon,
  TopHeaderBlock,
  Title,
  ContentTitle,
} from './styled';

interface Props {
  navigation: Navigation;
}

export const AddCardScreen: React.FC<Props> = ({ navigation }) => {
  const route = navigation.state.params ? navigation.state.params.route : 'create';
  const isEditViewScreen = route === 'edit';
  const { card_number, cardHolder, card_expiration, card_cvc, createStatus } = useSelector(
    (state: RootState) => state.cardReducer,
  );

  const { userId, userToken } = useSelector((state: RootState) => state.userReducer);

  const getUserCard = useAction(Actions.getUserCard);

  useEffect(() => {
    if (isEditViewScreen) {
      getUserCard();
    }
  }, [isEditViewScreen, route]);

  useEffect(() => {
    // Edit existing card data
    // Using when user user press on card item in Payment Details screen
    const isEditExistingCard =
      isEditViewScreen &&
      !!card_number &&
      card_number.length > 0 &&
      !!cardHolder &&
      cardHolder.length > 0 &&
      !!card_expiration &&
      card_expiration.length > 0;

    // Create first user's card
    // Using on initial registration
    const isAddFirstCard = !isEditExistingCard && !card_number && !cardHolder && !card_expiration;

    // Create new card to change some existing card
    // Using when user user press 'Add new card' button in Payment Details screen
    const isCreateNewCard = !isEditExistingCard && !isAddFirstCard;

    if (isEditExistingCard) {
      Linking.openURL(
        `${
          config.WEBSITE_URI
        }add-card?mode=edit-existing-card&user-id=${userId}&token=${userToken}&card-number=${card_number}&card-holder=${encodeURIField(
          cardHolder,
        )}&card-expiration=${encodeURIField(card_expiration)}}`,
      );
    } else if (isCreateNewCard) {
      Linking.openURL(
        `${config.WEBSITE_URI}add-card?mode=add-new-card&user-id=${userId}&token=${userToken}`,
      );
    }
  }, [isEditViewScreen, userId, userToken, card_number, cardHolder, card_expiration, card_cvc]);

  useEffect(() => {
    if (createStatus) {
      navigation.navigate('Home');
    }
  }, [createStatus]);

  const goBack = useCallback(() => navigation.goBack(), []);

  return (
    <Container>
      <Header isEditViewScreen={isEditViewScreen}>
        {isEditViewScreen && (
          <GoBackBlock onPress={goBack}>
            <GoBackIcon />
          </GoBackBlock>
        )}
        <TopHeaderBlock>
          <Title>{isEditViewScreen ? 'Payment details' : 'Add your card'}</Title>
        </TopHeaderBlock>
      </Header>
      <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <ContentTitle>Waiting for web action...</ContentTitle>
      </View>
    </Container>
  );
};
