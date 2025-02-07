import mongoose from 'mongoose';
import { searchKeyword } from '@/lib/serpApi';
import { IKeyword } from '@/types';
import searchData from '@/search_data.json';

export const getKeywordData = (srcObj: any, existingData: any) => {
  const keywordData: IKeyword = {
    term: srcObj?.search_parameters?.q || srcObj?.term,
    kgmid: srcObj?.knowledge_graph?.kgmid,
    kgmTitle: srcObj?.knowledge_graph?.title,
    kgmWebsite: srcObj?.knowledge_graph?.website,
    location: srcObj?.search_parameters?.location_used || 'United States',
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
  for (const keyword of searchData) {
    const serpResponse: any = await searchKeyword(
      keyword.term,
      keyword.location,
      keyword.device
    );
    const keywordData: IKeyword = getKeywordData(serpResponse, {
      ...keyword,
      isDefaultKeywords: true,
    });

    await Keyword.findOneAndUpdate(
      {
        term: keyword.term,
        location: keyword.location,
        device: keyword.device,
        isDefaultKeywords: true,
      },
      keywordData,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  }
}
