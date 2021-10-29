/* eslint-disable react/no-this-in-sfc */
import React from 'react';
import { StatusBar } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { useScreens } from 'react-native-screens';
import { useSelector } from 'react-redux';

import { isIOS } from 'utils/helpers';
import { RootState } from 'types';
import Api from 'api';

import { OnBoardingScreen } from 'view/screens/OnBoardingScreen';

import { SignUpScreen } from 'view/screens/SignUpScreen';

import { SelectCharityScreen } from 'view/screens/SelectCharityScreen';
import { BanksListScreen } from 'view/screens/BanksListScreen';
import { CreateBankAccountScreen } from 'view/screens/CreateBankAccountScreen';
import { AddCardScreen } from 'view/screens/AddCardScreen';
import { ScanCardIOS } from 'view/screens/ScanCardScreen';
import { SelectWeeklyAmountScreen } from 'view/screens/SelectWeeklyAmountScreen';

import { HomeScreen } from 'view/screens/HomeScreen';
import { ProfileSettingsScreen } from 'view/screens/ProfileSettingsScreen';
import { WaitingActionScreen } from 'view/screens/WaitingActionScreen';

if (isIOS) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useScreens();
}

const AuthStack = createStackNavigator(
  {
    SignUp: SignUpScreen,
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFFFFF' },
    },
  },
);

const CreateBankAccountStack = createStackNavigator(
  {
    BanksList: BanksListScreen,
    CreateBankAccount: CreateBankAccountScreen,
    WaitingForAction: WaitingActionScreen,
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFFFFF' },
    },
  },
);

const CharityStack = createStackNavigator(
  {
    SelectCharity: SelectCharityScreen,
    AuthorizeCharity: CreateBankAccountStack,
    AddCard: AddCardScreen,
    ScanCard: ScanCardIOS,
    SelectWeeklyAmount: {
      screen: SelectWeeklyAmountScreen,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFFFFF' },
    },
  },
);

const AddCardStack = createStackNavigator(
  {
    AddCard: AddCardScreen,
    ScanCard: ScanCardIOS,
    SelectWeeklyAmount: {
      screen: SelectWeeklyAmountScreen,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFFFFF' },
    },
  },
);

const HomeStack = createStackNavigator(
  {
    HomeScreen,
    SelectCharity: SelectCharityScreen,
    ProfileSettings: {
      screen: ProfileSettingsScreen,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    AddCard: AddCardScreen,
    ScanCard: ScanCardIOS,
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFFFFF' },
    },
  },
);

const HeadStack = (initialRouteName: string) =>
  createSwitchNavigator(
    {
      OnBoardingScreen,
      Auth: AuthStack,
      CharityStack,
      CreateBankAccountStack,
      AddCardStack,
      SelectWeeklyAmount: {
        screen: SelectWeeklyAmountScreen,
        navigationOptions: {
          gestureEnabled: false,
        },
      },
      Home: HomeStack,
    },
    {
      initialRouteName,
    },
  );

export const AppContainer = () => {
  const { isOnBoardingReviewed } = useSelector((state: RootState) => state.onboardingReducer);
  const userToken = useSelector((state: RootState) => state.userReducer.userToken);
  const has_bank = useSelector((state: RootState) => state.userReducer.has_bank);
  const has_card = useSelector((state: RootState) => state.userReducer.has_card);
  const has_charity = useSelector((state: RootState) => state.userReducer.has_charity);
  const isSetWeeklyGoal = useSelector((state: RootState) => state.userReducer.isSetWeeklyGoal);

  if (userToken) {
    Api.setAuthToken(userToken);
  }

  let initialRouteName = 'OnBoardingScreen';
  if (!isOnBoardingReviewed) {
    initialRouteName = 'OnBoardingScreen';
  } else if (!userToken) {
    initialRouteName = 'Auth';
  } else if (userToken && !has_charity && !has_bank) {
    initialRouteName = 'CharityStack';
  } else if (has_charity && !isSetWeeklyGoal) {
    initialRouteName = 'SelectWeeklyAmount';
  } else if (has_charity && isSetWeeklyGoal && !has_bank) {
    initialRouteName = 'CreateBankAccountStack';
  } else if (has_bank && !has_card) {
    initialRouteName = 'AddCardStack';
  } else {
    initialRouteName = 'Home';
  }

  const Container = createAppContainer(HeadStack(initialRouteName));

  return (
    <>
      <StatusBar backgroundColor="#1D65BC" barStyle="light-content" />
      <Container
        ref={item => {
          this.navigation = item;
        }}
      />
    </>
  );
};
