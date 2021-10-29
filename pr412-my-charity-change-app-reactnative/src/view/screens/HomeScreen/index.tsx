import React, { useState, useMemo, useEffect } from 'react';
import { Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';
import { encodeURIField } from 'utils/helpers';
import { useAction } from 'utils/hooks';
import { config } from 'config';
import * as Actions from 'modules/notifications/actions';
import { getUserCard as rawGetUserCard, resetCardReducer } from 'modules/card/actions';
import { getUser, resetUserReducer } from 'modules/user/actions';
import { getUserCharity, getUserFeed, resetCharityReducer } from 'modules/charity/actions';
import { RootState, Navigation } from 'types';

import { TabLabel, TabScene } from 'view/components';
import { MyImpactContainer } from 'view/containers/MyImpactContainer';
import { PersonalDetails } from 'view/containers/PersonalDetails';
import { StyledTabBar } from './styled';

enum Tabs {
  MyImpact = 'MyImpact',
  PersonalDetails = 'PersonalDetails',
}

interface Props {
  navigation: Navigation;
}

export const HomeScreen: React.FC<Props> = React.memo(({ navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const { userId, userToken, user, isLoadingUserData, getUserDataError } = useSelector(
    (state: RootState) => state.userReducer,
  );
  const { userCharityData, isLoadingCharityData, getUserCharityError } = useSelector(
    (state: RootState) => state.charityReducer,
  );

  const getUserCard = useAction(rawGetUserCard);
  const initNotifications = useAction(Actions.initNotifications);
  const resetNotifications = useAction(Actions.resetNotifications);
  const getUserData = useAction(getUser);
  const getUserCharityData = useAction(getUserCharity);
  const getUserFeedData = useAction(getUserFeed);
  const resetReducer = useAction(resetCharityReducer);
  const resetUserDataReducer = useAction(resetUserReducer);
  const resetCardDataReducer = useAction(resetCardReducer);

  useEffect(() => {
    const route = navigation.state.params && navigation.state.params.route;
    if (route) {
      getUserData();
      getUserCharityData();
    }
    initNotifications();
    getUserData();
    getUserCard();
    getUserCharityData();
    getUserFeedData(false);
  }, [navigation]);

  useEffect(() => {
    return () => {
      resetNotifications();
    };
  }, []);

  const onRefresh = () => {
    getUserData();
    getUserCharityData();
    getUserFeedData(false);
  };

  const { cardHolder, card_expiration } = useSelector((state: RootState) => state.cardReducer);

  const tabHome = [
    { key: Tabs.MyImpact, title: 'My Impact' },
    { key: Tabs.PersonalDetails, title: 'Personal Details' },
  ];

  const tabViewScenes = SceneMap({
    [Tabs.MyImpact]: useMemo(
      () =>
        TabScene(() => (
          <MyImpactContainer
            user={user}
            isLoadingUserData={isLoadingUserData}
            userCharityData={userCharityData}
            isLoadingCharityData={isLoadingCharityData}
            getUserCharityError={getUserCharityError}
            getUserDataError={getUserDataError}
            onRefresh={onRefresh}
            goToChooseCharity={() => {
              resetUserDataReducer();
              resetReducer();
              navigation.navigate('SelectCharity', { route: 'edit' });
            }}
            goToProfile={() => {
              resetCardDataReducer();
              resetUserDataReducer();
              navigation.navigate('ProfileSettings');
            }}
          />
        )),
      [user, isLoadingUserData, userCharityData, isLoadingCharityData],
    ),
    [Tabs.PersonalDetails]: useMemo(
      () =>
        TabScene(() => (
          <PersonalDetails
            editCard={() => {
              resetCardDataReducer();
              Linking.openURL(
                `${config.WEBSITE_URI}add-card?mode=edit-existing-card&user-id=${userId}&` +
                  `token=${userToken}&` +
                  `card-number=${user.card.card_ending}&` +
                  `card-holder=${encodeURIField(cardHolder)}&` +
                  `card-expiration=${encodeURIField(card_expiration)}`,
              );
            }}
            onRefresh={onRefresh}
          />
        )),
      [userId, userToken, user, cardHolder, card_expiration],
    ),
  });

  return (
    <TabView
      renderScene={tabViewScenes}
      onIndexChange={setTabIndex}
      navigationState={{ index: tabIndex, routes: tabHome }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      renderTabBar={props => <StyledTabBar renderLabel={TabLabel} {...props} />}
      lazy
    />
  );
});
