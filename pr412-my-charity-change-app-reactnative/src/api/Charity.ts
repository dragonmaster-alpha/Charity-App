import { AxiosResponse } from 'axios';

import Api from '.';

export type ListCharitiesResponse = AxiosResponse<{
  id: number;
  name: string;
  logo: string;
  is_selected: boolean;
}>;

export type CharityResponse = AxiosResponse<{
  all_time_amount: number;
  charities: [];
  weekly_amount: number;
}>;

export type FeedResponse = AxiosResponse<{
  donations: {};
  next_page: null | number;
  pages: number;
}>;

interface CharityCreateBody {
  charity_ids: number[];
}

export class Charity {
  static getCharitiesList = (
    userId: number,
    searchValue: string | null,
    filterData: string | null,
  ) => {
    let filters = '';
    if (filterData) {
      filters = `?categories=${encodeURIComponent(filterData)}`;
    }
    let search = '';
    if (filterData && searchValue) {
      search = `&search=${searchValue}`;
    }
    if (searchValue) {
      search = `?search=${searchValue}`;
    }
    return Api.get(`v1/customer/${userId}/charities${filters}${search}`);
  };

  static getFilterCharity = () => Api.get(`v1/categories`);

  static getUserCharity = (userId: number) => Api.get(`v1/customer/${userId}/impact`);

  static getUserFeed = (userId: number, page: number) =>
    Api.get(`v1/customer/${userId}/transactions?page=${page}`);

  static createUserCharity = (userId: number, params: CharityCreateBody) =>
    Api.put(`v1/customer/${userId}/charities`, params);

  static sendReceipt = () => Api.get(`v1/customer/send_report`);
}
