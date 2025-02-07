export interface IKeyword {
  term: string;
  kgmid: string | null;
  kgmTitle: string | null;
  kgmWebsite: string | null;
  location: string;
  device: string;
  organicResultsCount: Number;
  isDefaultKeywords: boolean;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
  dynamicData?: {
    id?: string;
    data?: Record<string, any>;
  };
}

export interface IAccount {
  account_email: string;
  account_id: string;
  account_rate_limit_per_hour: number;
  account_status: string;
  extra_credits: number;
  last_hour_searches: number;
  plan_id: string;
  plan_monthly_price: number;
  plan_name: string;
  plan_searches_left: number;
  searches_per_month: number;
  this_hour_searches: number;
  this_month_usage: number;
}
