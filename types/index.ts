export interface IKeyword {
  term: string;
  kgmid: string | null;
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
