import { getHtml, getJson, getLocations, getAccount } from 'serpapi';
import { ISearchKeywordParams } from '@/types';

export async function searchLocations(loc: string = '', limit: number) {
  return await getLocations({
    q: loc,
    limit: limit || 10,
  });
}

export async function getAccountInfo() {
  const data = await getAccount({
    api_key: process.env.SERP_API_KEY,
  });
  delete data['api_key'];
  return data;
}

export async function searchKeyword({
  keyword,
  location,
  device,
  type = 'json',
  start = 0,
  num = 10,
}: ISearchKeywordParams) {
  const searchData = {
    q: keyword,
    api_key: process.env.SERP_API_KEY,
    location: location || '',
    engine: 'google',
    device: device || 'desktop',
    output: type,
    include_ai_overview: 'true',
    gl: 'us',
    start,
    num,
  };
  if (type === 'html') {
    return await getHtml(searchData);
  }
  return await getJson(searchData);
}
