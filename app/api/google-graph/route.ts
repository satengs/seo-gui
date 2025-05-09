import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';

interface DetailedDescription {
  articleBody: string;
  url: string;
  license: string;
}

interface Image {
  contentUrl: string;
  url: string;
  license: string;
}

interface KnowledgeGraphResult {
  '@id': string;
  '@type': string[];
  name: string;
  description: string;
  detailedDescription: DetailedDescription;
  image: Image;
  url: string;
  resultScore: number;
}

interface EntitySearchResult {
  '@id': string;
  result: KnowledgeGraphResult;
  resultScore: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const page = parseInt(searchParams.get('page') || '1');
    const size = parseInt(searchParams.get('size') || '30');
    const searchTerm = searchParams.get('searchTerm') || '';
    const sortKey = searchParams.get('sortKey') || '';
    const sortDirection = searchParams.get('sortDirection') || 'asc';

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword parameter is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find the keyword in the database
    const keywordDoc = await Keyword.findOne({ term: keyword });
    if (!keywordDoc) {
      return NextResponse.json(
        { error: 'Keyword not found' },
        { status: 404 }
      );
    }

    // Check if API key is available
    if (!process.env.GOOGLE_API_KEY) {
      console.error('Google API key is not configured');
      return NextResponse.json(
        { error: 'Google API key is not configured' },
        { status: 500 }
      );
    }


    // Make the API request to Google Knowledge Graph using the keyword directly
    const response = await axios.get(
      `https://kgsearch.googleapis.com/v1/entities:search`,
      {
        params: {
          query: keyword,
          key: process.env.GOOGLE_API_KEY,
          limit: 10,
          indent: true,
        },
      }
    );


    if (!response.data.itemListElement) {
      console.error('Unexpected API response format:', response.data);
      return NextResponse.json(
        { error: 'Unexpected response format from Google Knowledge Graph API' },
        { status: 500 }
      );
    }

    if (response.data.itemListElement.length === 0) {
      return NextResponse.json(
        { error: 'No Knowledge Graph results found for this keyword' },
        { status: 404 }
      );
    }

    // Transform the response data
    const entitiesData = response.data.itemListElement.map((item: EntitySearchResult) => ({
      _id: item['@id'],
      name: item.result.name,
      type: item.result['@type'].join(', '),
      description: item.result.description,
      detailedDescription: item.result.detailedDescription?.articleBody || '',
      image: item.result.image?.contentUrl || '',
      website: item.result.url || '',
      score: item.resultScore,
    }));

    // Apply search filter if searchTerm is provided
    const filteredData = searchTerm
      ? entitiesData.filter((item: any) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : entitiesData;

    // Apply sorting if sortKey is provided
    const sortedData = sortKey
      ? [...filteredData].sort((a: any, b: any) => {
          const aValue = a[sortKey];
          const bValue = b[sortKey];
          if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        })
      : filteredData;

    return NextResponse.json({
      entitiesData: sortedData,
      totalCount: sortedData.length,
      totalPages: 1,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error in Google Graph API:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      return NextResponse.json(
        {
          error: 'Failed to fetch Knowledge Graph data',
          details: error.response?.data?.error?.message || error.message
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch Knowledge Graph data' },
      { status: 500 }
    );
  }
}
