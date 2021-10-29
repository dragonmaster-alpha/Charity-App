import { createAction } from 'deox';

export const resetStore = createAction('app/RESET_STORE');

export const onNewDeeplinkReceived = createAction(
  'app/ON_NEW_DEEPLINK_RECEIVED',
  resolve => ( uri: string, isInit: boolean = false ) => {
    return resolve({ uri, isInit });
  }
);
export const startListenDeeplinkSuccess = createAction('app/START_LISTEN_DEEPLINK_SUCCESS');
export const stopListenDeeplink = createAction('app/STOP_LISTEN_DEEPLINK');
export const stopListenDeeplinkSuccess = createAction('app/STOP_LISTEN_DEEPLINK_SUCCESS');
