export interface IAccount {
  account_id?: string;
  account_email?: string;
  full_name?: string;
  plan_searches_left?: number;
  searches_per_month?: number;
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
  _id: string;
  term: string;
  kgmid?: string;
  location: string;
  device: 'desktop' | 'mobile' | 'tablet';
  keyword_term: string;
  isDefaultKeywords: boolean;
  historicalData: Map<string, DailyData>;
  createdAt: string;
  updatedAt: string;
}

export interface SearchKeywordResponse {
  searchInformation?: {
    totalResults?: number;
    searchTime?: number;
    formattedTotalResults?: string;
  };
  knowledgeGraph?: {
    title?: string;
    website?: string;
    type?: string;
    description?: string;
  };
  error?: string;
}

export interface PaginationResult<T> {
  entitiesData: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}