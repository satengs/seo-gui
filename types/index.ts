export interface IKeyword {
  term: string;
  category: string;
  geography: string;
  isDefaultKeywords: boolean;
  searchMetadata?: Record<string, any> | null;
  searchParameters?: Record<string, any> | null;
  searchInformation?: Record<string, any> | null;
  ads?: Array<Record<string, any>>;
  relatedQuestions?: Array<string>;
  organicResults?: Array<Record<string, any>>;
  perspectives?: Array<Record<string, any>>;
  topStoriesLink?: string;
  topStoriesSerpapiLink?: string;
  relatedSearches?: Array<string>;
  discussionsAndForums?: Array<Record<string, any>>;
  knowledgeGraph?: {
    id?: string;
    data?: Record<string, any>;
  };
  aiOverview?: {
    id?: string;
    data?: Record<string, any>;
  };
}
