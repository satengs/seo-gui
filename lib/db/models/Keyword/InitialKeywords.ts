import mongoose from 'mongoose';
import { searchKeyword } from '@/lib/serpApi';
import { IKeyword } from '@/types';

const initialKeywords = [
  {
    term: 'freedom debt relief',
  },
  {
    term: 'freedom debt relief reviews',
  },
  {
    term: 'is freedom debt relief a scam',
  },
  {
    term: 'is freedom debt relief legit',
  },
  {
    term: 'freedom debt relief company',
  },
  {
    term: 'does freedom debt relief hurt your credit',
  },
  {
    term: 'is freedom debt relief a good idea',
  },
];

export const getKeywordData = (srcObj: any, existingData: any) => {
  const keywordData: IKeyword = {
    term: srcObj?.search_parameters?.q || srcObj?.term,
    kgmid: srcObj?.knowledge_graph?.kgmid,
    location: srcObj?.search_parameters?.location || 'United States',
    device: srcObj?.search_parameters?.device,
    organicResultsCount: srcObj?.organic_results?.length || 0,
    isDefaultKeywords: existingData?.isDefaultKeywords,
    dynamicData: {
      data: { ...srcObj },
    },
  };
  return keywordData;
};

export async function seedInitialKeywords() {
  const Keyword = mongoose.models.Keyword;

  for (const keyword of initialKeywords) {
    const serpResponse: any = await searchKeyword(
      keyword.term,
      'United States',
      'mobile'
    );
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
