import { ResponseErrors } from 'types/responseData';

export interface Values {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthState {
  values: Values;
  registerStatus: boolean;
  errors: ResponseErrors;
}
