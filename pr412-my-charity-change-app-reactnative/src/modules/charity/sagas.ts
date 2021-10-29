import { put, takeLatest, delay, select } from 'redux-saga/effects';
import { getType, ActionType } from 'deox';

import { Charity, CharityResponse, FeedResponse, ListCharitiesResponse } from 'api/Charity';
import { RootState } from 'types';

import { processRequestError } from 'modules/errors/actions';
import { setUserCharity } from 'modules/user/actions';
import {
  getCharitiesList,
  getCharitiesListSuccess,
  setCheckedGetCharitiesListSuccess,
  getCharitiesListFail,
  getFilterCharity,
  getFilterCharitySuccess,
  getFilterCharityFail,
  getUserCharity,
  getUserCharitySuccess,
  getUserCharityFail,
  getUserFeed,
  getUserFeedSuccess,
  getMoreUserFeedSuccess,
  getUserFeedFail,
  createUserCharity,
  createUserCharitySuccess,
  createUserCharityFail,
  sendReceipt,
  sendReceiptSuccess,
  sendReceiptFail,
} from './actions';

function* getCharitiesListSaga({ payload }: ActionType<typeof getCharitiesList>) {
  try {
    const { userId } = yield select((state: RootState) => state.userReducer);
    const { searchValue, checkFilter } = yield select((state: RootState) => state.charityReducer);
    const filterData: string[] = [];
    checkFilter.map((el: { label: string }) => filterData.push(el.label));
    const search = payload ? null : searchValue;
    const filter = payload ? null : filterData.join(',');
    const { data }: ListCharitiesResponse = yield Charity.getCharitiesList(userId, search, filter);
    if (payload) {
      yield put(setCheckedGetCharitiesListSuccess(data));
    } else {
      yield put(getCharitiesListSuccess(data));
    }
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: getCharitiesListFail }));
  }
}

function* getFilterCharitySaga() {
  try {
    const { data }: any = yield Charity.getFilterCharity();
    const filterArr = Object.keys(data).reduce((res, v) => {
      return res.concat(data[v]);
    }, []);
    yield put(getFilterCharitySuccess(filterArr));
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: getFilterCharityFail }));
  }
}

function* createUserCharitySaga() {
  try {
    const { userId } = yield select((state: RootState) => state.userReducer);
    const { checkSelected } = yield select((state: RootState) => state.charityReducer);
    const requestData = {
      charity_ids: checkSelected.map((e: { label: number }) => e.label),
    };
    yield Charity.createUserCharity(userId, requestData);
    yield put(setUserCharity());
    yield put(createUserCharitySuccess());
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: createUserCharityFail }));
  }
}

function* getUserCharitySaga() {
  try {
    const { userId } = yield select((state: RootState) => state.userReducer);
    const { data }: CharityResponse = yield Charity.getUserCharity(userId);
    yield put(setUserCharity());
    yield put(getUserCharitySuccess(data));
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: getUserCharityFail }));
  }
}

function* getUserFeedSaga({ payload }: ActionType<typeof getUserFeed>) {
  try {
    const { userId } = yield select((state: RootState) => state.userReducer);
    const { next_page } = yield select((state: RootState) => state.charityReducer);
    let page = 1;
    if (payload && next_page) {
      page = next_page;
    }
    const { data }: FeedResponse = yield Charity.getUserFeed(userId, page);
    if (payload) {
      yield put(getMoreUserFeedSuccess(data));
    } else {
      yield put(getUserFeedSuccess(data));
    }
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: getUserFeedFail }));
  }
}

function* sendReceiptSaga() {
  try {
    const { data }: CharityResponse = yield Charity.sendReceipt();
    yield put(sendReceiptSuccess(data.message));
  } catch (e) {
    yield put(processRequestError({ error: e, failAction: sendReceiptFail }));
  }
}

export function* watchCharityPeriodically() {
  while (true) {
    // get charity and user feed 5 times per day
    yield delay(17280000);
    yield put(getUserCharity());
    yield put(getUserFeed(false));
  }
}

export function* watchCharity() {
  yield takeLatest(getType(getCharitiesList), getCharitiesListSaga);
  yield takeLatest(getType(getFilterCharity), getFilterCharitySaga);
  yield takeLatest(getType(createUserCharity), createUserCharitySaga);
  yield takeLatest(getType(getUserCharity), getUserCharitySaga);
  yield takeLatest(getType(getUserFeed), getUserFeedSaga);
  yield takeLatest(getType(sendReceipt), sendReceiptSaga);
}
