import { createReducer, createAction } from 'deox';

export const reviewOnBoarding = createAction('review/REVIEW_ONBOARDING');

export interface Onboarding {
  isOnBoardingReviewed: boolean;
}

const initialState: Onboarding = {
  isOnBoardingReviewed: false,
};

export const onboardingReducer = createReducer(initialState, handle => [
  handle(reviewOnBoarding, state => ({
    ...state,
    isOnBoardingReviewed: true,
  })),
]);
