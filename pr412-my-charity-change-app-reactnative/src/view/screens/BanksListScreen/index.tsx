/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';
import { config } from 'config';
import { useAction } from 'utils/hooks';
import { Navigation, RootState } from 'types';
import * as Actions from 'modules/bank/actions';

interface Props {
  navigation: Navigation;
}

export const BanksListScreen: React.FC<Props> = memo(({ navigation }) => {
  const getTopBanks = useAction(Actions.getTopBanks);
  const getBanksList = useAction(Actions.getBanksList);
  const { userId, userToken } = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    Linking.openURL(`${config.WEBSITE_URI}connect-account?user-id=${userId}&token=${userToken}`);
    navigation.replace('WaitingForAction', { title: 'Connecting accounts' });
  }, []);

  useEffect(() => {
    getTopBanks();
    getBanksList('');
  }, []);

  return null;
});
