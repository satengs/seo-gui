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
  kgmTitle?: string;
  kgmWebsite?: string;
  location: string;
  device: 'desktop' | 'mobile' | 'tablet';
  keywordTerm: string;
  organicResultsCount: number;
  isDefaultKeywords: boolean;
  keywordData: any;
  historicalData: any;
  createdAt: string;
  updatedAt: string;
}

export interface SearchKeywordResponse {
  search_information?: {
    query_displayed: string;
    total_results?: number;
    time_taken_displayed?: number;
    organic_results_state?: string;
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
