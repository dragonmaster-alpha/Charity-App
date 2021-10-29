import { AxiosResponse } from 'axios';

import Api from '.';

export interface UserCard {
  card_id: number;
  card_ending: string;
}

export type UserProfileResponse = AxiosResponse<{
  email: string;
  first_name: string;
  last_name: string;
  weekly_goal: number;
  weekly_amount: number;
  card: UserCard;
  access_token?: string;
}>;

export interface UpdateUserData {
  weekly_goal: number;
  first_name: string;
  last_name: string;
  email: string;
}

export class UserProfile {
  static getUserProfile = (userId: number) => Api.get(`v1/customer/${userId}/profile`);
  static updateUserProfile = (userId: number, requestData: UpdateUserData) =>
    Api.put(`v1/customer/${userId}/profile`, requestData);
  static updateWeeklyGoal = (userId: number, weekly_goal: number) =>
    Api.put(`v1/customer/${userId}/profile`, { weekly_goal });
}
