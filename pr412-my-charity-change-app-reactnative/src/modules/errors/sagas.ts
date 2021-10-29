/* eslint-disable prefer-destructuring */
import { put, takeEvery } from 'redux-saga/effects';
import { getType, ActionType } from 'deox';

import { ResponseErrors } from 'types';

import { logOut } from 'modules/auth/actions';
import { processRequestError } from './actions';

const globalErrorName = 'object_error';

function* processRequestErrorSaga({
  payload: { error, failAction },
}: ActionType<typeof processRequestError>) {
  const errors: ResponseErrors = {};

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    switch (error.response.status) {
      case 400: {
        const { data } = error.response;
        Object.keys(data).forEach(key => {
          // eslint-disable-next-line prefer-destructuring
          if (key === 'detail' || key === 'msg' || key === 'card') {
            errors[key] = data[key];
          } else {
            errors[key] = data[key][0];
          }
        });
        break;
      }
      case 401:
      case 403:
      case 422:
        yield put(logOut());
        return;
      default:
        // 500, 502
        errors[globalErrorName] = 'Server error';
        break;
    }
  } else if (error.request) {
    // The request was made but no response was received
    if (error.request.status === 0) {
      errors[globalErrorName] = 'Network error. Check your internet connection.';
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    errors[globalErrorName] = 'Something went wrong';
  }

  yield put(failAction(errors));
}

export function* watchErrors() {
  yield takeEvery(getType(processRequestError), processRequestErrorSaga);
}
