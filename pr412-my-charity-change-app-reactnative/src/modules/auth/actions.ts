import { createAction } from 'deox';

import { ResponseErrors } from 'types/responseData';
import { UserProfile } from 'modules/user/types';
import { Values } from './types';

export const changeValue = createAction(
  'auth/CHANGE_VALUE',
  resolve => (payload: Partial<Values> | Partial<UserProfile>) => resolve(payload),
);

export const register = createAction('auth/REGISTER_REQUEST');

export const registerSuccess = createAction('auth/REGISTER_SUCCESS');

export const registerFail = createAction(
  'auth/REGISTER_FAIL',
  resolve => (payload: ResponseErrors) => resolve(payload),
);

export const logOut = createAction('auth/LOGOUT_REQUEST');
