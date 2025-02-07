import { getHtml, getJson, getLocations, getAccount } from 'serpapi';

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

export async function getAccountInfo() {
  const data = await getAccount({
    api_key: process.env.SERP_API_KEY,
  });
  delete data['api_key'];
  return data;
}
