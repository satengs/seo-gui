import { getHtml, getJson, getLocations, getAccount } from 'serpapi';


const API_KEY = process.env.NEXT_PUBLIC_SERP_API_KEY;

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

export async function searchKeyword(
    keyword: string,
    location?: string,
    device?: string,
    type = 'json'
) {
  const searchData = {
    q: keyword,
    api_key: process.env.SERP_API_KEY,
    location: location || '',
    engine: 'google',
    device: device || 'desktop',
    output: type,
    include_ai_overview: 'true',
    gl: 'us',
  };
  if (type === 'html') {
    return await getHtml(searchData);
  }
  return await getJson(searchData);
}