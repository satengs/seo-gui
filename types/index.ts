import { DateRange } from 'react-day-picker';

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
  lastSearchDate: Date;
}

export interface DailyData {
  organicResultsCount: number;
  kgmTitle?: string;
  kgmWebsite?: string;
  difficulty: number | null;
  volume: number | null;
  backlinksNeeded: number | null;
  timestamp: string;
}

export interface IKeyword {
  _doc?: any;
  _id: string;
  term: string;
  kgmid?: string;
  kgmTitle?: string;
  kgmWebsite?: string;
  location: string;
  device: 'desktop' | 'mobile' | 'tablet';
  keywordTerm: string;
  organicResultsCount: number;
  isDefaultKeywords: boolean;
  tags?: string[];
  keywordData: IKeywordData;
  historicalData: any;
  organicResultsHistoricalData?: IOrganicResultsHistoricalData;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IKeywordData {
  data: SearchKeywordResponse;
  _id: string;
}

export interface IPaginatedKeywords {
  entitiesData: IKeyword[];
  totalCount: any;
  totalPages: number;
  currentPage: number;
}

export interface IPaginateData<T> {
  entitiesData: T[];
  totalCount: any;
  totalPages: number;
  currentPage: number;
}

export interface IHistoricalKeyword {
  date: Date;
  kgmid: string;
  kgmTitle: string;
  kgmWebsite: string;
  totalResultsCount: number;
  timestamp: Date;
}

export interface IOrganicResultsHistoricalData {
  [key: string]: any;
}

export interface IHistoricalMapEntry {
  [key: string]: IHistoricalData;
}

export interface IHistoricalEntry {
  organicResultsCount: number;
  kgmid: string;
  kgmTitle: string;
  kgmWebsite: string;
  backlinksNeeded: number | null;
  difficulty: number | null;
  keywordData: IKeywordData;
  timestamp: string;
  volume: number | null;
}

export interface IHistoricalData {
  _id: string;
  data: IHistoricalKeyword;
}

export interface SearchKeywordResponse {
  search_information?: {
    query_displayed?: string;
    total_results?: number;
    time_taken_displayed?: number;
    organic_results_state?: string;
    volume?: number | null;
    difficulty?: number | null;
  };
  knowledge_graph?: {
    title?: string;
    entity_type?: string;
    kgmid?: string;
    website?: string;
    knowledge_graph_search_link?: string;
    serpapi_knowledge_graph_search_link?: string;
    profiles?: any[];
  };
  search_metadata?: {
    id: string;
    status: string;
    json_endpoint: string;
    created_at: string;
    processed_at: string;
    google_url: string;
    raw_html_file: string;
    total_time_taken: number;
  };
  search_parameters?: {
    engine: string;
    q: string;
    location_requested: string;
    location_used: string;
    google_domain: string;
    device: string;
  };
  organic_results?: any[];
  related_questions?: any[];
  related_searches?: any[];
  error?: string;
}

export interface PaginationResult<T> {
  entitiesData: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ISortObj {
  [key: string]: number;
}

export interface ISortConfig {
  sortKey: string;
  sortDirection: string;
}

export interface IKeywordPaginateParams {
  page?: number;
  perPage?: number;
  size?: number;
  searchTerm?: string;
  sortBy?: ISortConfig;
  rangeOfDate?: DateRange | undefined;
}

export interface IFeaturedIcon {
  icon: any;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export interface ISearchKeywordParams {
  keyword: string;
  location?: string;
  device?: string;
  type?: string;
  start?: number;
  num?: number;
}

export interface ILoginFormValues {
  email: string;
  password: string;
}

export interface IRegisterFormValues extends ILoginFormValues {
  fullName: string;
}

export interface INewLocationFormValues {
  location: string[];
  longitude: number;
  latitude: number;
  countryCode?: string;
}

export interface ISerpLocation {
  id: string;
  _id: string;
  canonical_name: string;
  country_code: string;
  google_id: number;
  google_parent_id: number | null;
  gps: number[];
  keys: string[];
  name: string;
  reach: number;
  target_type: string;
}

export interface ILocation {
  _id: string;
  location: string;
  longitude: number;
  latitude: number;
  gos?: [];
  [key: string]: any;
  label: string;
  value: string;
}

export interface IOptionLocation extends ILocation {
  value: string;
  label: string;
}
