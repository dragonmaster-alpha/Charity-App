/* eslint-disable no-console */
import React from 'react';
import { Route } from 'react-native-tab-view';

import { TabBarLabel } from './styled';

export const TabLabel = ({ route, focused }: { focused: boolean; route: Route }) => (
  <TabBarLabel focused={focused}>{route.title}</TabBarLabel>
);

export const TabScene = (Component: React.ElementType) => () => <Component />;
