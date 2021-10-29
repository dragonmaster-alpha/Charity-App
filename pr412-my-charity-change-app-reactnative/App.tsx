import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import SplashScreen from 'react-native-splash-screen';

import { useAction } from './src/utils/hooks';

import * as Actions from './src/modules/notifications/actions';

import { theme } from './src/global-styled/theme';
import { AppContainer } from './src/router';

// eslint-disable-next-line no-console
console.disableYellowBox = true;
export const App: React.FC = () => {
  const initNotifications = useAction(Actions.initNotifications);
  const resetNotifications = useAction(Actions.resetNotifications);
  useEffect(() => {
    SplashScreen.hide();
    initNotifications();
  }, []);

  useEffect(() => {
    // returned function will be called on component unmount
    return () => {
      resetNotifications();
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <AppContainer />
    </ThemeProvider>
  );
};
