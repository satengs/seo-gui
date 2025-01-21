import mongoose from 'mongoose';
import { searchKeyword } from '@/lib/serpApi';
import { IKeyword } from '@/types';

const initialKeywords = [
  {
    term: 'freedom debt relief',
    category: 'Brand',
    geography: 'United States',
    isDefaultKeywords: true,
  },
  {
    term: 'freedom debt relief reviews',
    category: 'Reviews',
    geography: 'United States',
    isDefaultKeywords: true,
  },
  {
    term: 'is freedom debt relief a scam',
    category: 'Trust',
    geography: 'United States',
    isDefaultKeywords: true,
  },
  {
    term: 'is freedom debt relief legit',
    category: 'Trust',
    geography: 'United States',
    isDefaultKeywords: true,
  },
  {
    term: 'freedom debt relief company',
    category: 'Brand',
    geography: 'United States',
    isDefaultKeywords: true,
  },
  {
    term: 'does freedom debt relief hurt your credit',
    category: 'Credit Impact',
    geography: 'United States',
    isDefaultKeywords: true,
  },
  {
    term: 'is freedom debt relief a good idea',
    category: 'Decision',
    geography: 'United States',
    isDefaultKeywords: true,
  },
];

export const getKeywordData = (srcObj: any, existingData: any) => {
  const keywordData: IKeyword = {
    ...existingData,
    term: existingData?.term,
    category: existingData?.category,
    geography: srcObj?.search_parameters?.location || 'United States',
    searchMetadata: srcObj?.search_metadata || null,
    searchParameters: srcObj?.search_parameters || null,
    searchInformation: srcObj?.search_information || null,
    ads: srcObj?.ads || [],
    relatedQuestions: srcObj?.relates_questions || [],
    organicResults: srcObj?.organic_results || [],
    perspectives: srcObj?.perspectives || [],
    topStoriesLink: srcObj?.top_stories_link || '',
    topStoriesSerpapiLink: srcObj?.top_stories_serpapi_link || '',
    relatedSearches: srcObj?.related_searches || [],
    discussionsAndForums: srcObj?.discussions_and_forums || [],
    isDefaultKeywords: existingData?.isDefaultKeywords,
    knowledgeGraph: {
      id: srcObj?.knowledge_graph?.kgmid,
      data: srcObj?.knowledge_graph,
    },
    aiOverview: {
      data: srcObj?.ai_overview,
    },
  };
  return keywordData;
};

export async function seedInitialKeywords() {
  const Keyword = mongoose.models.Keyword;

  for (const keyword of initialKeywords) {
    const serpResponse: any = await searchKeyword(keyword.term);
    const keywordData: IKeyword = getKeywordData(serpResponse, keyword);

    await Keyword.findOneAndUpdate(
      { term: keyword.term, isDefaultKeywords: true },
      keywordData,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }
}
