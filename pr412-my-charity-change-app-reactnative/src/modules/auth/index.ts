/* eslint-disable @typescript-eslint/camelcase */
import { createReducer } from 'deox';

import { validateField } from 'utils/validation';
import { changeValue, register, registerSuccess, registerFail } from './actions';
import { AuthState } from './types';

const defaultState: AuthState = {
  values: {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  },
  registerStatus: false,
  errors: {},
};

export const authReducer = createReducer(defaultState, handle => [
  handle(
    changeValue,
    (state, { payload }): AuthState => {
      const key = Object.keys(payload);
      const value = Object.values(payload);
      return {
        ...state,
        values: {
          ...state.values,
          ...payload,
        },
        errors: {
          ...state.errors,
          [key[0]]: validateField(key[0], String(value[0])),
        },
      };
    },
  ),
  handle(
    register,
    (state): AuthState => ({
      ...state,
      errors: {},
      registerStatus: true,
    }),
  ),
  handle(
    registerSuccess,
    (state): AuthState => ({
      ...state,
      registerStatus: false,
    }),
  ),
  handle(
    registerFail,
    (state, { payload }): AuthState => ({
      ...state,
      registerStatus: false,
      errors: payload,
    }),
  ),
]);
