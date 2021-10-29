import { ResponseErrors } from 'types/responseData';

export interface UserCharity {
  all_time_amount: number;
  charities: [];
  weekly_amount: number;
}

export interface FeedData {
  donations: {};
  next_page: null | number;
  pages: number;
}

export interface Feed {
  [key: number]: {
    description: string;
    amount: number;
    donat_amount: number;
  };
}

export interface Charity {
  id: number;
  name: string;
  logo: string;
  is_selected: boolean;
}

export interface Filter {
  id: number;
  name: string;
}

export interface CheckedFilter {
  label: string;
}

export interface CheckSelected {
  label: number;
}

export interface CharityState {
  userCharityData: UserCharity;
  isLoadingCharityData: boolean;
  getUserCharityError: ResponseErrors;
  userFeedData: Feed[];
  next_page: number | null;
  page: number;
  getUserFeedError: ResponseErrors;
  charitiesList: Charity[];
  isLoadingCharitiesList: boolean;
  getCharitiesListError: ResponseErrors;
  filterList: Filter[];
  checkFilter: CheckedFilter[];
  searchValue: string;
  checkSelected: CheckSelected[];
  isCreatedUserCharity: boolean;
  isLoadingCreatedUserCharity: boolean;
  createdUserCharityError: ResponseErrors;
  isLoadingSendReceipt: boolean;
  alertMessage: string;
}
