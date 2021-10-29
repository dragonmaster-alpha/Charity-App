import { ResponseErrors } from 'types/responseData';

export interface BanksList {
  [key: number]: {
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
  };
}

export interface Values {
  loginId: string;
  password: string;
  secondaryLoginId: string;
  securityCode: string;
}

export interface BanksState {
  banksList: BanksList[];
  topBanks: BanksList[];
  isLoadingBanksList: boolean;
  isLoadingTopBanksList: boolean;
  getBanksListError: ResponseErrors;
  values: Values;
  errors: ResponseErrors;
  isLoadingCreateBankAccount: boolean;
}
