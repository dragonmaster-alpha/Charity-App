/* eslint-disable no-console */
import { takeLatest, put, select } from 'redux-saga/effects';
import { CardIOModule } from 'react-native-awesome-card-io';

import { Card, CardResponse } from 'api/Card';
import { RootState } from 'types';

import { processRequestError } from 'modules/errors/actions';
import { setUserCreatedCard } from 'modules/user/actions';
import {
  scanCard,
  setScanCard,
  createUserCard,
  createUserCardSuccess,
  createUserCardFail,
  getUserCard,
  getUserCardSuccess,
  getUserCardFail,
} from './actions';

function* scanCardSaga() {
  try {
    const card = yield CardIOModule.scanCard({
      hideCardIOLogo: true,
      suppressManualEntry: true,
      scanInstructions: 'Hold card here. It will scan automatically.',
      suppressConfirmation: true,
      scanExpiry: true,
    });
    yield put(setScanCard(card));
  } catch (err) {
    // the user cancelled
    console.log(err);
  }
}

function* createUserCardSaga() {
  try {
    const { userId } = yield select((state: RootState) => state.userReducer);
    const { card_number, cardHolder, card_expiration, card_cvc } = yield select(
      (state: RootState) => state.cardReducer,
    );
    const requestData = {
      card_number: card_number.replace(/\s/g, ''),
      card_holder: cardHolder,
      card_expiration,
      card_cvc,
    };
    yield Card.createUserCard(userId, requestData);
    yield put(setUserCreatedCard());
    yield put(createUserCardSuccess());
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: createUserCardFail }));
  }
}

function* getUserCardSaga() {
  try {
    const { userId } = yield select((state: RootState) => state.userReducer);
    const { data }: CardResponse = yield Card.getUserCard(userId);
    yield put(getUserCardSuccess(data));
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: getUserCardFail }));
  }
}

export function* watchCard() {
  yield takeLatest(scanCard, scanCardSaga);
  yield takeLatest(createUserCard, createUserCardSaga);
  yield takeLatest(getUserCard, getUserCardSaga);
}
