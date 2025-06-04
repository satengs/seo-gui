import axiosClient from '@/lib/axiosClient';
import { AxiosError } from 'axios';

interface GoogleGraphResponse {
  entitiesData: any[];
  error?: string;
}

interface TransformedEntity {
  _id: string;
  name: string;
  type: string;
  description: string;
  detailedDescription: {
    articleBody: string;
    url: string;
  };
  image: string;
  website: string;
}

export class GoogleGraphApiService {
  private static instance: GoogleGraphApiService;
  private apiKey: string;
  private batchSize: number = 5;
  private retryDelay: number = 1000;

  private constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Google API key is not configured');
    }
  }

  public static getInstance(): GoogleGraphApiService {
    if (!GoogleGraphApiService.instance) {
      GoogleGraphApiService.instance = new GoogleGraphApiService();
    }
    return GoogleGraphApiService.instance;
  }

  private transformEntity(entity: any): TransformedEntity {
    const transformed = {
      _id: entity['@id'] || '',
      name: entity.name || '',
      type: Array.isArray(entity['@type'])
        ? entity['@type'].join(', ')
        : entity['@type'] || '',
      description: entity.description || '',
      detailedDescription: {
        articleBody: entity.detailedDescription?.articleBody || '',
        url: entity.detailedDescription?.url || '',
      },
      image: entity.image?.contentUrl || '',
      website: entity.url || '',
    };
    return transformed;
  }

  private async makeApiRequest(query: string): Promise<GoogleGraphResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Google API key is not configured');
      }

      const url = 'https://kgsearch.googleapis.com/v1/entities:search';
      const params = {
        query,
        key: this.apiKey,
        limit: 10,
        indent: true,
      };

      const response = await axiosClient.get(url, {
        params,
        timeout: 10000,
      });

      if (!response.data) {
        throw new Error('No data in response');
      }

      const entitiesData = (response.data.itemListElement || [])
        .map((item: any) => item.result)
        .filter(Boolean)
        .map(this.transformEntity.bind(this));

      return { entitiesData };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('[Google Graph API Service] Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        return {
          entitiesData: [],
          error: error.response?.data?.error?.message || error.message,
        };
      }

      return {
        entitiesData: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  public async processBatch(
    queries: string[]
  ): Promise<Map<string, GoogleGraphResponse>> {
    const results = new Map<string, GoogleGraphResponse>();
    const batches = this.chunkArray(queries, this.batchSize);

    for (const batch of batches) {
      try {
        const batchPromises = batch.map((query) => this.makeApiRequest(query));
        const batchResults = await Promise.all(batchPromises);

        batch.forEach((query, index) => {
          results.set(query, batchResults[index]);
        });

        if (batches.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      } catch (error) {
        console.error(
          '[Google Graph API Service] Batch processing error:',
          error
        );
      }
    }

    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
