import { put, takeLatest, select } from 'redux-saga/effects';
import { getType } from 'deox';

import { UserProfile, UserProfileResponse } from 'api/UserProfile';
import { RootState } from 'types';
import Api from 'api';

import { processRequestError } from 'modules/errors/actions';
import {
  getUser,
  getUserSuccess,
  getUserFail,
  updateUser,
  updateUserSuccess,
  updateUserFail,
  updateWeeklyGoal,
  updateWeeklyGoalSuccess,
  updateWeeklyGoalFail,
  setUserToken,
} from './actions';

function* getUserProfileSaga() {
  try {
    const { userId } = yield select((state: RootState) => state.userReducer);
    const { data }: UserProfileResponse = yield UserProfile.getUserProfile(userId);
    yield put(getUserSuccess(data));
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: getUserFail }));
  }
}

function* updateUserProfileSaga() {
  try {
    const {
      userId,
      user: { weekly_goal, first_name, last_name, email },
    } = yield select((state: RootState) => state.userReducer);

    const requestData = {
      weekly_goal,
      first_name,
      last_name,
      email,
    };

    const { data }: Partial<UserProfileResponse> = yield UserProfile.updateUserProfile(
      userId,
      requestData,
    );
    if (data && data.access_token) {
      Api.setAuthToken(data.access_token);
      yield put(setUserToken(data.access_token));
    }

    yield put(updateUserSuccess(data));
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: updateUserFail }));
  }
}

function* updateWeeklyGoalSaga() {
  try {
    const {
      userId,
      user: { weekly_goal },
    } = yield select((state: RootState) => state.userReducer);

    const { data }: Partial<UserProfileResponse> = yield UserProfile.updateWeeklyGoal(
      userId,
      weekly_goal,
    );
    yield put(updateWeeklyGoalSuccess(data));
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: updateWeeklyGoalFail }));
  }
}

export function* watchUserProfile() {
  yield takeLatest(getType(getUser), getUserProfileSaga);
  yield takeLatest(getType(updateUser), updateUserProfileSaga);
  yield takeLatest(getType(updateWeeklyGoal), updateWeeklyGoalSaga);
}
