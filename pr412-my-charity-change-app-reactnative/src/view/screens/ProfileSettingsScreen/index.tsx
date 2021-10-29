/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
import { Linking } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { config } from 'config';
import { useAction } from 'utils/hooks';
import { pick, encodeURIField } from 'utils/helpers';
import { Navigation, RootState } from 'types';
import * as Actions from 'modules/auth/actions';
import { getUserCard as rawGetUserCard } from 'modules/card/actions';
import { setWeeklyAmount, updateUser } from 'modules/user/actions';
import { WeeklyGoal, globalErrorBlock } from 'view/components';
import { Input } from 'view/components/uiKit/Input';
import { Box } from 'view/components/uiKit/Box';

import {
  Container,
  Header,
  GoBackBlock,
  GoBackIcon,
  Title,
  StyledKeyboardAvoidingView,
  MainBlock,
  StyledScrollView,
  InputWrapper,
  PaymentDetailsBlock,
  GoToPaymentDetails,
  PaymentInfoBlock,
  FeedIconBlock,
  StyledCardImage,
  PaymentInfoWrapper,
  PaymentTitle,
  PaymentInfo,
  StyledNextIcon,
  ButtonWrapper,
  StyledButton,
} from './styled';

interface Props {
  navigation: Navigation;
}

export const ProfileSettingsScreen: React.FC<Props> = React.memo(({ navigation }) => {
  const {
    userId,
    userToken,
    user,
    errors,
    isLoadingUpdateUserData,
    isUpdateUserData,
  } = useSelector((state: RootState) => state.userReducer);
  const getUserCard = useAction(rawGetUserCard);

  const changeWeeklyAmount = useAction(setWeeklyAmount);
  const changeValue = useAction(Actions.changeValue);
  const updateUserData = useAction(updateUser);

  useEffect(() => {
    if (isUpdateUserData) {
      navigation.navigate('HomeScreen');
    }
  }, [isUpdateUserData]);

  useEffect(() => {
    getUserCard();
  }, []);

  const { cardHolder, card_expiration } = useSelector((state: RootState) => state.cardReducer);
  const { checkSelected } = useSelector((state: RootState) => state.charityReducer);

  const goBack = useCallback(() => {
    navigation.navigate('HomeScreen', { route: 'notUpdate' });
  }, []);

  const isButtonDisabled = React.useMemo(() => {
    const required = pick(user, ['first_name', 'last_name', 'email']);
    return (
      Object.values(required).some(v => !v.trim()) ||
      (Object.keys(errors)[0] !== 'object_error' && Object.values(errors).some(v => !!v.trim()))
    );
  }, [user, errors]);

  const charitiesCount = (checkSelected || []).length || 1;
  return (
    <Container>
      {/* header */}
      <Header>
        <GoBackBlock onPress={goBack}>
          <GoBackIcon />
        </GoBackBlock>
        <Title>Profile settings</Title>
      </Header>
      {/* main block */}
      <StyledKeyboardAvoidingView>
        <MainBlock>
          {Object.keys(errors).length === 1 &&
            Object.keys(errors)[0] === 'object_error' &&
            globalErrorBlock(errors)}
          <StyledScrollView>
            <Box mb={10}>
              <WeeklyGoal
                minValue={2 * charitiesCount}
                weeklyValue={user.weekly_goal}
                onValueChange={(value: number) => changeWeeklyAmount(value)}
              />
            </Box>
            <Box mb={15}>
              <InputWrapper>
                <Input
                  label="First Name"
                  placeholder="Alex"
                  maxLength={50}
                  key="firstName"
                  textContentType="name"
                  value={user.first_name}
                  onChangeText={(value: string) => changeValue({ first_name: value })}
                  error={errors.first_name}
                  autoCapitalize="sentences"
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  maxLength={50}
                  key="lastName"
                  textContentType="name"
                  value={user.last_name}
                  onChangeText={(value: string) => changeValue({ last_name: value })}
                  error={errors.last_name}
                  autoCapitalize="sentences"
                />
              </InputWrapper>
              <InputWrapper>
                <Input
                  label="Email Address"
                  placeholder="example@mail.com"
                  maxLength={50}
                  key="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  autoCompleteType="email"
                  value={user.email}
                  onChangeText={(value: string) => changeValue({ email: value })}
                  error={errors.email}
                />
              </InputWrapper>
            </Box>
            <PaymentDetailsBlock>
              <GoToPaymentDetails
                onPress={() => {
                  Linking.openURL(
                    `${config.WEBSITE_URI}add-card?mode=edit-existing-card&user-id=${userId}&` +
                      `token=${userToken}&` +
                      `card-number=${user.card.card_ending}&` +
                      `card-holder=${encodeURIField(cardHolder)}&` +
                      `card-expiration=${encodeURIField(card_expiration)}`,
                  );
                }}
              >
                <PaymentInfoBlock>
                  <FeedIconBlock>
                    <StyledCardImage />
                  </FeedIconBlock>
                  <PaymentInfoWrapper>
                    <PaymentTitle>Payment details</PaymentTitle>
                    <PaymentInfo>{`Card ending ${user.card.card_ending}`}</PaymentInfo>
                  </PaymentInfoWrapper>
                </PaymentInfoBlock>
                <StyledNextIcon />
              </GoToPaymentDetails>
            </PaymentDetailsBlock>
          </StyledScrollView>
          <ButtonWrapper>
            <StyledButton
              disabled={isButtonDisabled}
              onPress={updateUserData}
              loading={isLoadingUpdateUserData}
              reverseLoader
            />
          </ButtonWrapper>
        </MainBlock>
      </StyledKeyboardAvoidingView>
    </Container>
  );
});
