import { AxiosResponse } from 'axios';

import Api from '.';

export type BankSystemResponse = AxiosResponse<{
  results: {
    shortName: string;
    securityCodeCaption: null | string;
    loginIdCaption: string;
    bank_id: string;
    name: string;
    tier: string;
    secondaryLoginIdCaption: null | string;
    logo_square: string;
    logo_full: string;
    passwordCaption: string;
  }[];
}>;

interface BankAccountBody {
  user_id: number;
  bank_id: string;
  loginId: string;
  password: string;
  secondaryLoginId?: string;
  securityCode?: string;
}

export class BankSystem {
  static getBanksList = (searchValue: string) =>
    Api.get(`v1/basiq/institutions?search=${searchValue}`);
  static getTopBanks = () => Api.get(`v1/basiq/institutions?tier=1`);
  static createUserBankAccount = (params: BankAccountBody) =>
    Api.post(`v1/basiq/connections`, params);
}
