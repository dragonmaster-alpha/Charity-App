import { ResponseErrors } from 'types/responseData';

export interface Card {
  card_number: string;
  card_holder: string;
  card_expiration: string;
  card_cvc: string;
  id: number;
}

export interface CardState {
  card_number: string;
  cardHolder: string;
  card_expiration: string;
  card_cvc: string;
  isChange: boolean;
  errors: ResponseErrors;
  isLoadingCreateUserCard: boolean;
  createStatus: boolean;
  isLoadingGetUserCard: boolean;
  globalErrors: ResponseErrors;
}
