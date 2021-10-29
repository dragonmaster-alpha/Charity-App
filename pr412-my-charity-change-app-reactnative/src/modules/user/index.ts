/* eslint-disable @typescript-eslint/camelcase */
import { createReducer } from 'deox';

import { validateField } from 'utils/validation';

import { changeValue } from 'modules/auth/actions';
import { setCheckedSelected } from 'modules/charity/actions';
import {
  setUser,
  setUserCharity,
  setUserCreatedCard,
  setWeeklyAmount,
  setStatusCreatedBankAccount,
  getUser,
  getUserSuccess,
  getUserFail,
  updateUser,
  updateUserSuccess,
  updateUserFail,
  updateWeeklyGoal,
  updateWeeklyGoalSuccess,
  updateWeeklyGoalFail,
  resetUserReducer,
  setUserToken,
} from './actions';
import { UserState } from './types';

const defaultState: UserState = {
  userId: null,
  user: {
    first_name: '',
    last_name: '',
    email: '',
    weekly_goal: 2,
    weekly_amount: 0,
  },
  isLoadingUserData: false,
  getUserDataError: {},
  errors: {},
  userToken: null,
  has_charity: false,
  has_bank: false,
  has_card: false,
  isSetWeeklyGoal: false,
  isLoadingUpdateUserData: false,
  isUpdateUserData: false,
  isCreatedUserCharity: false,
};

export const userReducer = createReducer(defaultState, handle => [
  handle(
    setUser,
    (state, { payload }): UserState => ({
      ...state,
      userId: payload.user_id,
      userToken: payload.access_token,
      has_charity: payload.has_charity,
      has_bank: payload.has_bank,
      has_card: payload.has_card,
    }),
  ),
  handle(setUserCharity, state => ({
    ...state,
    isCreatedUserCharity: true,
    has_charity: true,
  })),
  handle(
    setStatusCreatedBankAccount,
    (state): UserState => ({
      ...state,
      has_bank: true,
    }),
  ),
  handle(setUserCreatedCard, state => ({
    ...state,
    has_card: true,
  })),
  handle(setCheckedSelected, (state, { payload }) => {
    const minvalues: { [key: number]: number } = {
      1: 2,
      2: 4,
      3: 6,
    };
    const minValue = minvalues[payload.length] || 2;

    return {
      ...state,
      user: {
        ...state.user,
        weekly_goal: state.user.weekly_goal > 6 ? state.user.weekly_goal : minValue,
      },
    };
  }),
  handle(
    setWeeklyAmount,
    (state, { payload }): UserState => ({
      ...state,
      user: {
        ...state.user,
        weekly_goal: payload,
      },
    }),
  ),
  handle(
    setUserToken,
    (state, { payload }): UserState => ({
      ...state,
      userToken: payload,
    }),
  ),
  handle(getUser, state => ({
    ...state,
    isLoadingUserData: true,
  })),
  handle(
    getUserSuccess,
    (state, { payload }): UserState => ({
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
      isLoadingUserData: false,
      errors: {},
      getUserDataError: {},
    }),
  ),
  handle(
    getUserFail,
    (state, { payload }): UserState => ({
      ...state,
      isLoadingUserData: false,
      getUserDataError: payload,
    }),
  ),
  handle(
    changeValue,
    (state, { payload }): UserState => {
      const key = Object.keys(payload);
      const value = Object.values(payload);
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
        errors: {
          ...state.errors,
          [key[0]]: validateField(key[0], String(value[0])),
        },
      };
    },
  ),
  handle(updateUser, state => ({
    ...state,
    isLoadingUpdateUserData: true,
    errors: {},
    getUserDataError: {},
  })),
  handle(
    updateUserSuccess,
    (state, { payload }): UserState => {
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
        isSetWeeklyGoal: true,
        isUpdateUserData: true,
        isLoadingUpdateUserData: false,
        errors: {},
        getUserDataError: {},
      };
    },
  ),
  handle(
    updateUserFail,
    (state, { payload }): UserState => ({
      ...state,
      isLoadingUpdateUserData: false,
      isUpdateUserData: false,
      errors: payload,
    }),
  ),
  handle(updateWeeklyGoal, state => ({
    ...state,
    isLoadingUpdateUserData: true,
    errors: {},
    getUserDataError: {},
  })),
  handle(
    updateWeeklyGoalSuccess,
    (state, { payload }): UserState => {
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
        isSetWeeklyGoal: true,
        isUpdateUserData: true,
        isLoadingUpdateUserData: false,
        errors: {},
        getUserDataError: {},
      };
    },
  ),
  handle(
    updateWeeklyGoalFail,
    (state, { payload }): UserState => ({
      ...state,
      isLoadingUpdateUserData: false,
      isUpdateUserData: false,
      errors: payload,
    }),
  ),
  handle(resetUserReducer, state => ({
    ...state,
    isUpdateUserData: false,
    isCreatedUserCharity: false,
  })),
]);
