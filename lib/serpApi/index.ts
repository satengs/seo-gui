import { getHtml, getJson, getLocations } from 'serpapi';

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
  };
  if (type === 'html') {
    return await getHtml(searchData);
  }
  return await getJson(searchData);
}

export async function searchLocations(loc: string = '', limit: number) {
  return await getLocations({
    q: loc,
    limit: limit || 10,
  });
}
