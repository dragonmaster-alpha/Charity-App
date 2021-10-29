import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { Onboarding } from 'modules/reviewOnboarding';
import { AuthState } from 'modules/auth/types';
import { CardState } from 'modules/card/types';
import { UserState } from 'modules/user/types';
import { CharityState } from 'modules/charity/types';
import { NotificationsState } from 'modules/notifications/types';
import { BanksState } from 'modules/bank/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {
  onboardingReducer: Onboarding;
  authReducer: AuthState;
  cardReducer: CardState;
  userReducer: UserState;
  charityReducer: CharityState;
  notificationsReducer: NotificationsState;
  bankReducer: BanksState;
}

export type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

export * from './responseData';
