import { createReducer } from 'deox';

import { setFcmToken } from './actions';
import { NotificationsState } from './types';

const defaultState: NotificationsState = {
  fcmToken: null,
};

export const notificationsReducer = createReducer(defaultState, handle => [
  handle(
    setFcmToken,
    (state, { payload }): NotificationsState => ({
      fcmToken: payload,
    }),
  ),
]);
