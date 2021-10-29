import { createAction } from 'deox';
import { ResponseErrors } from 'types/responseData';
import { UserCharity, FeedData, Charity, Filter, CheckedFilter, CheckSelected } from './types';

export const getCharitiesList = createAction(
  'charity/GET_CHARITIES_LIST_REQUEST',
  resolve => (payload: boolean) => resolve(payload),
);

export const getCharitiesListSuccess = createAction(
  'charity/GET_CHARITIES_LIST_SUCCESS',
  resolve => (payload: Charity[]) => resolve(payload),
);

export const setCheckedGetCharitiesListSuccess = createAction(
  'charity/SET_CHECKED_GET_CHARITIES_LIST_SUCCESS',
  resolve => (payload: Charity[]) => resolve(payload),
);

export const getCharitiesListFail = createAction(
  'charity/GET_CHARITIES_LIST_FAIL',
  resolve => (payload: ResponseErrors) => resolve(payload),
);

export const getFilterCharity = createAction('charity/GET_FILTER_CHARITY_REQUEST');

export const getFilterCharitySuccess = createAction(
  'charity/GET_FILTER_CHARITY_SUCCESS',
  resolve => (payload: Filter[]) => resolve(payload),
);

export const getFilterCharityFail = createAction(
  'charity/GET_FILTER_CHARITY_FAIL',
  resolve => (payload: ResponseErrors) => resolve(payload),
);

export const setFilterSelected = createAction(
  'charity/SET_FILTER_SELECTED',
  resolve => (payload: CheckedFilter[]) => resolve(payload),
);

export const setCheckedSelected = createAction(
  'charity/SET_CHECKED_SELECTED',
  resolve => (payload: CheckSelected[]) => resolve(payload),
);

export const changeValue = createAction('charity/CHANGE_VALUE', resolve => (payload: string) =>
  resolve(payload),
);

export const getUserCharity = createAction('charity/GET_USER_CHARITY_REQUEST');

export const getUserCharitySuccess = createAction(
  'charity/GET_USER_CHARITY_SUCCESS',
  resolve => (payload: UserCharity) => resolve(payload),
);

export const getUserCharityFail = createAction(
  'charity/GET_USER_CHARITY_FAIL',
  resolve => (payload: ResponseErrors) => resolve(payload),
);

export const getUserFeed = createAction(
  'charity/GET_USER_FEED_REQUEST',
  resolve => (payload: boolean) => resolve(payload),
);

export const getUserFeedSuccess = createAction(
  'charity/GET_USER_FEED_SUCCESS',
  resolve => (payload: FeedData) => resolve(payload),
);

export const getMoreUserFeedSuccess = createAction(
  'charity/GET_MORE_USER_FEED_SUCCESS',
  resolve => (payload: FeedData) => resolve(payload),
);

export const getUserFeedFail = createAction(
  'charity/GET_USER_FEED_FAIL',
  resolve => (payload: ResponseErrors) => resolve(payload),
);

export const createUserCharity = createAction('charity/CREATE_USER_CHARITY_REQUEST');

export const createUserCharitySuccess = createAction('charity/CREATE_USER_CHARITY_SUCCESS');

export const createUserCharityFail = createAction(
  'charity/CREATE_USER_CHARITY_FAIL',
  resolve => (payload: ResponseErrors) => resolve(payload),
);

export const resetCharityReducer = createAction('charity/RESET_CHARITY_REDUCER');

export const sendReceipt = createAction('charity/SEND_RECEIPT_REQUEST');

export const sendReceiptSuccess = createAction(
  'charity/SEND_RECEIPT_SUCCESS',
  resolve => (payload: string) => resolve(payload),
);

export const sendReceiptFail = createAction(
  'charity/SEND_RECEIPT_FAIL',
  resolve => (payload: ResponseErrors) => resolve(payload),
);
