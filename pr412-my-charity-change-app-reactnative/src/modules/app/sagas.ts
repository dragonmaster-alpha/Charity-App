/* eslint-disable no-console */
import { Linking } from 'react-native';
import { put, take, takeLatest, takeEvery, spawn, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { getType } from 'deox';

import { logOut } from 'modules/auth/actions';
import { getUserCard, createUserCardSuccess } from 'modules/card/actions';
import { setStatusCreatedBankAccount, setUserCreatedCard } from 'modules/user/actions';
import { createBankAccountSuccess } from 'modules/bank/actions';
import {
  resetStore,
  onNewDeeplinkReceived,
  startListenDeeplinkSuccess,
  stopListenDeeplink,
  stopListenDeeplinkSuccess,
} from './actions';

function* resetStoreSaga() {
  yield put(resetStore());
}

const deeplinkingStartListen = (onEvent: any) => {
  Linking.addEventListener('url', onEvent);
};

const deeplinkingStopListen = (onEvent: any) => {
  return Linking.removeEventListener('url', onEvent);
};

const deeplinkingChannel = () =>
  eventChannel((emit: any) => {
    const callback = (data: any) => emit(data);
    const listener = deeplinkingStartListen(callback);
    console.log('listener: ', listener);
    return () => deeplinkingStopListen(callback);
  });

function* getInitDeeplink() {
  return yield Linking.getInitialURL();
}

function* listenDeeplinking() {
  const uri = yield getInitDeeplink();

  if (uri) {
    yield put(onNewDeeplinkReceived(uri, true));
    // yield put( actions.startListenInAppPushNotificationPress( false ));
  } else {
    // If no deeplinks, navigate user to it's start page( depending on state )
    // yield put( startListenInAppPushNotificationPress( true ));
  }
  const channel = yield call(deeplinkingChannel);

  yield put(startListenDeeplinkSuccess());

  yield takeEvery(channel, function*(data: any) {
    yield put(onNewDeeplinkReceived(data.url));
  });

  yield take(getType(stopListenDeeplink));
  yield take('App/STOP_LISTEN_DEEPLINK');
  channel.close();
  yield put(stopListenDeeplinkSuccess());
}

function* onNewDeeplink({ payload }: any) {
  try {
    const { uri, isInit } = payload;
    console.log('isInit: ', isInit);

    if (!!uri && uri.length > 0) {
      if (uri.indexOf('add-first-card-success') > -1) {
        yield put(getUserCard());
        yield put(setUserCreatedCard());
        yield put(createUserCardSuccess());
      } else if (uri.indexOf('add-card-success') > -1) {
        yield put(getUserCard());
        yield put(setUserCreatedCard());
        yield put(createUserCardSuccess());
      } else if (uri.indexOf('change-existing-card-success') > -1) {
        yield put(getUserCard());
        yield put(setUserCreatedCard());
        yield put(createUserCardSuccess());
      } else if (uri.indexOf('add-bank-account-and-card-success') > -1) {
        yield put(setStatusCreatedBankAccount());
        yield put(createBankAccountSuccess());
        yield put(getUserCard());
        yield put(setUserCreatedCard());
        yield put(createUserCardSuccess());
        yield put(getUserCard());
      }
    }
  } catch (err) {
    console.log(err);
  }
}

export function* watchApp() {
  yield spawn(listenDeeplinking);
  yield takeLatest(getType(logOut), resetStoreSaga);
  yield takeLatest(getType(onNewDeeplinkReceived), onNewDeeplink);
}
