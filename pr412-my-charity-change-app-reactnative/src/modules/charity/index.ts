/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/camelcase */
import { createReducer } from 'deox';

import {
  getCharitiesList,
  getCharitiesListSuccess,
  setCheckedGetCharitiesListSuccess,
  getCharitiesListFail,
  getFilterCharity,
  getFilterCharitySuccess,
  getFilterCharityFail,
  setFilterSelected,
  changeValue,
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
  setCheckedSelected,
  resetCharityReducer,
  sendReceipt,
  sendReceiptSuccess,
  sendReceiptFail,
} from './actions';
import { CharityState } from './types';

const defaultState: CharityState = {
  userCharityData: {},
  userFeedData: [],
  next_page: null,
  isLoadingCharityData: false,
  getUserCharityError: {},
  isLoadMore: true,
  getUserFeedError: {},
  charitiesList: [],
  isLoadingCharitiesList: false,
  getCharitiesListError: {},
  searchValue: '',
  filterList: [],
  checkFilter: [],
  checkSelected: [],
  isLoadingCreatedUserCharity: false,
  createdUserCharityError: {},
  isLoadingSendReceipt: false,
  alertMessage: '',
};

export const charityReducer = createReducer(defaultState, handle => [
  handle(getCharitiesList, state => ({
    ...state,
    isLoadingCharitiesList: true,
  })),
  handle(
    getCharitiesListSuccess,
    (state, { payload }): CharityState => ({
      ...state,
      charitiesList: payload,
      isLoadingCharitiesList: false,
      getCharitiesListError: {},
    }),
  ),
  handle(
    setCheckedGetCharitiesListSuccess,
    (state, { payload }): CharityState => {
      const selectedArray: any = [];
      payload.map(el => {
        if (el.is_selected) {
          selectedArray.push({ label: el.id });
        }
      });
      return {
        ...state,
        checkSelected: selectedArray,
        charitiesList: payload,
        isLoadingCharitiesList: false,
        getCharitiesListError: {},
      };
    },
  ),
  handle(
    getCharitiesListFail,
    (state, { payload }): CharityState => ({
      ...state,
      isLoadingCharitiesList: false,
      getCharitiesListError: payload,
    }),
  ),
  handle(getFilterCharity, state => ({
    ...state,
  })),
  handle(
    getFilterCharitySuccess,
    (state, { payload }): CharityState => ({
      ...state,
      filterList: payload,
    }),
  ),
  handle(
    getFilterCharityFail,
    (state, { payload }): CharityState => ({
      ...state,
    }),
  ),
  handle(
    setFilterSelected,
    (state, { payload }): CharityState => ({
      ...state,
      checkFilter: payload,
    }),
  ),
  handle(
    changeValue,
    (state, { payload }): CharityState => ({
      ...state,
      searchValue: payload,
    }),
  ),
  handle(
    setCheckedSelected,
    (state, { payload }): CharityState => ({
      ...state,
      checkSelected: payload,
    }),
  ),
  handle(getUserCharity, state => ({
    ...state,
    isLoadingCharityData: true,
  })),
  handle(
    getUserCharitySuccess,
    (state, { payload }): CharityState => ({
      ...state,
      userCharityData: payload,
      isLoadingCharityData: false,
      getUserCharityError: {},
    }),
  ),
  handle(
    getUserCharityFail,
    (state, { payload }): CharityState => ({
      ...state,
      isLoadingCharityData: false,
      getUserCharityError: payload,
    }),
  ),
  handle(getUserFeed, state => ({
    ...state,
  })),
  handle(
    getMoreUserFeedSuccess,
    (state, { payload }): CharityState => {
      const feedArray: any[] = [];
      Object.entries(payload.donations).forEach(([key, value]) => feedArray.push({ [key]: value }));
      const nextFeed = state.userFeedData;
      const newArrayFeed = [...nextFeed, ...feedArray];
      return {
        ...state,
        userFeedData: newArrayFeed,
        next_page: payload.next_page,
      };
    },
  ),
  handle(
    getUserFeedSuccess,
    (state, { payload }): CharityState => {
      const feedArray: any[] = [];
      Object.entries(payload.donations).forEach(([key, value]) => feedArray.push({ [key]: value }));
      return {
        ...state,
        userFeedData: feedArray,
        next_page: payload.next_page,
        getUserFeedError: {},
      };
    },
  ),
  handle(
    getUserFeedFail,
    (state, { payload }): CharityState => ({
      ...state,
      getUserFeedError: payload,
    }),
  ),
  handle(createUserCharity, state => ({
    ...state,
    isLoadingCreatedUserCharity: true,
    createdUserCharityError: {},
  })),
  handle(createUserCharitySuccess, state => ({
    ...state,
    isLoadingCreatedUserCharity: false,
    createdUserCharityError: {},
  })),
  handle(
    createUserCharityFail,
    (state, { payload }): CharityState => ({
      ...state,
      isLoadingCreatedUserCharity: false,
      createdUserCharityError: payload,
    }),
  ),
  handle(resetCharityReducer, state => ({
    ...state,
    createdUserCharityError: {},
    searchValue: '',
    checkFilter: [],
    alertMessage: '',
  })),
  handle(sendReceipt, state => ({
    ...state,
    isLoadingSendReceipt: true,
    getUserFeedError: {},
  })),
  handle(
    sendReceiptSuccess,
    (state, { payload }): CharityState => ({
      ...state,
      isLoadingSendReceipt: false,
      getUserFeedError: {},
      alertMessage: payload,
    }),
  ),
  handle(
    sendReceiptFail,
    (state, { payload }): CharityState => ({
      ...state,
      isLoadingSendReceipt: false,
      getUserFeedError: payload,
    }),
  ),
]);
