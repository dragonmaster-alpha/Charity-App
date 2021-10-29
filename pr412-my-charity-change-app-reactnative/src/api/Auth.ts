import Api from '.';

interface AuthBody {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export class Register {
  static register = (params: AuthBody) => Api.post('v1/customer/signup', params);
}
