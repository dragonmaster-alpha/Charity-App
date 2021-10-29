import { put, select, takeLatest } from 'redux-saga/effects';
import { getType } from 'deox';
import firebase from 'react-native-firebase';

import Api from 'api';
import { Register } from 'api/Auth';
import { RootState } from 'types';

import { processRequestError } from 'modules/errors/actions';
import { setUser } from 'modules/user/actions';
import { register, registerSuccess, registerFail } from './actions';

function* registerSaga() {
  try {
    const { values } = yield select((state: RootState) => state.authReducer);
    const { fcmToken } = yield select((state: RootState) => state.notificationsReducer);
    const firebaseToken = yield firebase.messaging().getToken();
    const requestData = {
      email: values.email.trim(),
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      password: values.password,
      device_token: fcmToken || firebaseToken,
    };
    const { data } = yield Register.register(requestData);
    Api.setAuthToken(data.access_token);
    yield put(setUser(data));
    yield put(registerSuccess());
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: registerFail }));
  }
}

export function* watchAuth() {
  yield takeLatest(getType(register), registerSaga);
}
