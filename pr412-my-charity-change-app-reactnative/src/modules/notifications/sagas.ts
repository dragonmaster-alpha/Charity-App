/* eslint-disable no-console */
import { put, takeLatest, select } from 'redux-saga/effects';
import { getType } from 'deox';
import firebase from 'react-native-firebase';

import { setNotificationsListeners, resetNotificationsListeners } from 'services/firebase';
import { initNotifications, resetNotifications, setFcmToken } from './actions';

function* initNotificationsSaga() {
  try {
    const { fcmToken: currentFcmToken } = yield select(state => state.notificationsReducer);
    const fcmToken = yield firebase.messaging().getToken();

    if (currentFcmToken !== fcmToken) {
      yield put(setFcmToken(fcmToken));
    }

    const enabled = yield firebase.messaging().hasPermission();
    if (!enabled) {
      yield firebase.messaging().requestPermission();
    }

    setNotificationsListeners();
  } catch (e) {
    console.log('e: ', e);
    // do nothing
  }
}

export function* watchNotifications() {
  yield takeLatest(getType(initNotifications), initNotificationsSaga);
  yield takeLatest(getType(resetNotifications), resetNotificationsListeners);
}
