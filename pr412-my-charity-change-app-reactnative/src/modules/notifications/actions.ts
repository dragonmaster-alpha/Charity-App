import { createAction } from 'deox';

export const initNotifications = createAction('notifications/INIT_NOTIFICATIONS');

export const resetNotifications = createAction('notifications/RESET_NOTIFICATIONS');

export const setFcmToken = createAction(
  'notifications/SET_FCM_TOKEN',
  resolve => (payload: string) => resolve(payload),
);

export const setOpenedNotifications = createAction(
  'notifications/SET_OPENED_NOTOFICATIONS',
  resolve => (payload: boolean) => resolve(payload),
);
