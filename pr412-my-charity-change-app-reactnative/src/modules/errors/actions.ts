import { createAction, Action } from 'deox';
import { AxiosError } from 'axios';

import { ResponseErrors } from 'types';

type abstractFailActionCreatorType = (payload: ResponseErrors) => Action<string, ResponseErrors>;

export const processRequestError = createAction(
  'errors/PROCESS_REQUEST_ERROR',
  resolve => (payload: { error: AxiosError; failAction: abstractFailActionCreatorType }) =>
    resolve(payload),
);
