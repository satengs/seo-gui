import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    await dbConnect();

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'Google API key is not configured' }, { status: 500 });
    }

    const response = await axios.get(
      `https://kgsearch.googleapis.com/v1/entities:search`,
      {
        params: {
          query,
          key: process.env.GOOGLE_API_KEY,
          indent: true,
        },
      }
    );

    if (!response.data.itemListElement) {
      return NextResponse.json({ error: 'Unexpected response format from Google Knowledge Graph API' }, { status: 500 });
    }

    if (response.data.itemListElement.length === 0) {
      return NextResponse.json({ error: 'No Knowledge Graph results found for this query', entitiesData: [] }, { status: 200 });
    }

    const entitiesData = response.data.itemListElement.map((item: any) => {
      if (!item || !item.result) return null;
      const result = item.result;
      return {
        _id: result['@id'] || '',
        name: result.name || '',
        type: Array.isArray(result['@type']) ? result['@type'].join(', ') : '',
        description: result.description || '',
        detailedDescription: {
          articleBody: result.detailedDescription?.articleBody || '',
          license: result.detailedDescription?.license || '',
          url: result.detailedDescription?.url || '',
        },
        image: result.image?.contentUrl || '',
        website: result.url || '',
        score: item.resultScore || 0,
      };
    }).filter(Boolean);

    return NextResponse.json({ entitiesData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Knowledge Graph data' }, { status: 500 });
  }
} 