import { AxiosResponse } from 'axios';

import Api from '.';

export type CardResponse = AxiosResponse<{
  card_number: string;
  card_holder: string;
  card_expiration: string;
  card_cvc: string;
  id: number;
}>;

interface CreateCardBody {
  card_number: string;
  card_holder: string;
  card_expiration: string;
  card_cvc: string;
}

export class Card {
  static createUserCard = (user_id: number, params: CreateCardBody) =>
    Api.post(`v1/customer/${user_id}/cards`, params);

  static getUserCard = (user_id: number) => Api.get(`v1/customer/${user_id}/cards`);
}
