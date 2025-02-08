export interface KnowledgeGraph {
    title?: string;
    website?: string;
    type?: string;
    description?: string;
}

export interface SearchInformation {
    totalResults?: number;
    searchTime?: number;
    formattedTotalResults?: string;
}

export interface SerpApiResponse {
    searchInformation?: SearchInformation;
    knowledgeGraph?: KnowledgeGraph;
    error?: string;
}

export type SearchKeywordResponse = SerpApiResponse;