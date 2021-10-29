/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Image, Linking } from 'react-native';

import { useAction } from 'utils/hooks';
import { RootState, Navigation } from 'types';
import { setWeeklyAmount, updateWeeklyGoal, resetUserReducer } from 'modules/user/actions';
import { Box } from 'view/components/uiKit/Box';
import { config } from 'config';

import { WeeklyGoal } from 'view/components';
import {
  Container,
  Header,
  Title,
  SubTitle,
  MainBlock,
  ButtonWrapper,
  StyledButton,
  ErrorBlock,
  ErrorText,
  GoBackBlock,
  GoBackIcon,
} from './styled';

interface Props {
  navigation: Navigation;
}

export const SelectWeeklyAmountScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isLoadingUpdateUserData, errors, isSetWeeklyGoal, userId, userToken } = useSelector(
    (state: RootState) => state.userReducer,
  );
  const has_bank = useSelector((state: RootState) => state.userReducer.has_bank);
  const { checkSelected } = useSelector((state: RootState) => state.charityReducer);

  const changeWeeklyAmount = useAction(setWeeklyAmount);
  const updateUserWeeklyAmount = useAction(updateWeeklyGoal);
  const resetUserDataReducer = useAction(resetUserReducer);

  useEffect(() => {
    if (isSetWeeklyGoal) {
      if (has_bank) {
        navigation.navigate('Home');
      } else {
        Linking.openURL(
          `${config.WEBSITE_URI}connect-account?user-id=${userId}&token=${userToken}`,
        );
      }
    }
  }, [isSetWeeklyGoal, has_bank]);

  const showGlobalErrors =
    Object.keys(errors).length > 0 && Object.keys(errors)[0] === 'object_error';

  const charitiesCount = (checkSelected || []).length || 1;

  const goBack = useCallback(() => {
    resetUserDataReducer();
    navigation.navigate('SelectCharity');
  }, []);

  return (
    <Container>
      {/* header */}
      <Header>
        <GoBackBlock onPress={() => goBack()}>
          <GoBackIcon />
        </GoBackBlock>
        <Title>Select weekly amount</Title>
        <SubTitle>
          Set the maximum weekly amount for round up. Minimum ${2 * charitiesCount}.
        </SubTitle>
      </Header>
      {/* main block */}
      <MainBlock>
        <WeeklyGoal
          minValue={2 * charitiesCount}
          weeklyValue={user.weekly_goal}
          onValueChange={(value: number) => changeWeeklyAmount(value)}
        />
        {showGlobalErrors && (
          <ErrorBlock>
            <ErrorText>{Object.values(errors)}</ErrorText>
          </ErrorBlock>
        )}
        <Box align="center" flex={1} center>
          <Image
            source={require('assets/img/logo.png')}
            style={{ width: 127.5, height: 114, marginBottom: 20.7 }}
            resizeMode="contain"
          />
        </Box>
        <ButtonWrapper>
          <StyledButton
            onPress={updateUserWeeklyAmount}
            loading={isLoadingUpdateUserData}
            reverseLoader
          />
        </ButtonWrapper>
      </MainBlock>
    </Container>
  );
};
