import { TabBar } from 'react-native-tab-view';
import styled from 'styled-components';
import { moderateScale } from 'react-native-size-matters';

import { statusBarHeight } from 'utils/helpers';

export const StyledTabBar = styled(TabBar).attrs({
  tabStyle: {
    minHeight: moderateScale(24, 0.5),
    paddingTop: moderateScale(30, 0.5),
    alignItems: 'center',
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff',
  },
})`
  padding-top: ${statusBarHeight};
  padding-horizontal: ${moderateScale(15, 0.5)};
  background-color: ${({ theme }) => theme.colors.main};
`;
