/* eslint-disable @typescript-eslint/camelcase */
import { createReducer } from 'deox';

import { validateField } from 'utils/validation';
import { CardState } from './types';

import {
  changeCardData,
  setScanCard,
  createUserCard,
  createUserCardSuccess,
  createUserCardFail,
  getUserCard,
  getUserCardSuccess,
  getUserCardFail,
  resetCardReducer,
} from './actions';

const defaultState: CardState = {
  card_number: '',
  cardHolder: '',
  card_expiration: '',
  card_cvc: '',
  isChange: false,
  errors: {},
  globalErrors: {},
  isLoadingCreateUserCard: false,
  createStatus: false,
  isLoadingGetUserCard: false,
};

export const cardReducer = createReducer(defaultState, handle => [
  handle(changeCardData, (state, { payload, meta }) => ({
    ...state,
    [payload]: meta,
    isChange: true,
    errors: {
      ...state.errors,
      [payload]: validateField(payload, String(meta)),
    },
    globalErrors: {},
  })),
  handle(
    setScanCard,
    (state, { payload }): CardState => {
      const expiryMonth =
        payload.expiryMonth > 10
          ? payload.expiryMonth.toString()
          : `0${payload.expiryMonth.toString()}`;
      return {
        ...state,
        isChange: true,
        card_number: payload.cardNumber || '',
        cardHolder: payload.cardholderName || '',
        card_expiration:
          payload.expiryYear > 0 ? `${expiryMonth} ${payload.expiryYear.toString().slice(-2)}` : '',
      };
    },
  ),
  handle(createUserCard, state => ({
    ...state,
    isLoadingCreateUserCard: true,
    errors: {},
  })),
  handle(createUserCardSuccess, state => ({
    ...state,
    isLoadingCreateUserCard: false,
    createStatus: true,
    errors: {},
    globalErrors: {},
  })),
  handle(
    createUserCardFail,
    (state, { payload }): CardState => {
      const isGlobalError =
        String(Object.keys(payload)) === 'card' || String(Object.keys(payload)) === 'object_error';
      return {
        ...state,
        isLoadingCreateUserCard: false,
        createStatus: false,
        errors: isGlobalError ? {} : payload,
        globalErrors: isGlobalError ? payload : {},
      };
    },
  ),
  handle(getUserCard, state => ({
    ...state,
    isLoadingGetUserCard: true,
    isChange: false,
    errors: {},
    globalErrors: {},
  })),
  handle(
    getUserCardSuccess,
    (state, { payload }): CardState => ({
      ...state,
      card_number: `0000${payload.card_number}`,
      cardHolder: payload.card_holder,
      card_expiration: payload.card_expiration,
      card_cvc: '',
      isLoadingGetUserCard: false,
      errors: {},
      globalErrors: {},
    }),
  ),
  handle(
    getUserCardFail,
    (state, { payload }): CardState => ({
      ...state,
      isLoadingGetUserCard: false,
      globalErrors: payload,
    }),
  ),
  handle(resetCardReducer, state => ({
    ...state,
    createStatus: false,
  })),
]);
