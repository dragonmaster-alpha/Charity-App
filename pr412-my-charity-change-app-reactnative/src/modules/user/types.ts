import { ResponseErrors } from 'types/responseData';
import { UserCard } from 'api/UserProfile';

export interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  weekly_goal: number;
  weekly_amount: number;
  card?: UserCard;
  isRegistration?: boolean;
  access_token?: string;
}

export interface UserState {
  userId: number | null;
  user: UserProfile;
  isLoadingUserData: boolean;
  getUserDataError: ResponseErrors;
  errors: ResponseErrors;
  userToken: string | null;
  createdBankAccountStatus?: boolean;
  has_bank: boolean;
  has_card: boolean;
  has_charity: boolean;
  isSetWeeklyGoal: boolean;
  isLoadingUpdateUserData: boolean;
  isUpdateUserData: boolean;
  isCreatedUserCharity: boolean;
}

export interface UserData {
  has_bank: boolean;
  has_card: boolean;
  has_charity: boolean;
  access_token: string;
  user_id: number;
}
