import axios from 'axios';

interface GoogleGraphResponse {
  entitiesData: any[];
  error?: string;
}

export class GoogleGraphApiService {
  private static instance: GoogleGraphApiService;
  private apiKey: string;
  private batchSize: number = 10;

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

  private async makeApiRequest(query: string): Promise<GoogleGraphResponse> {
    try {
      console.log(
        '[Google Graph API Service] Making request for query:',
        query
      );

      if (!this.apiKey) {
        throw new Error('Google API key is not configured');
      }

      const response = await axios.get(
        'https://kgsearch.googleapis.com/v1/entities:search',
        {
          params: {
            query,
            key: this.apiKey,
            indent: true,
          },
        }
      );


      if (!response.data.itemListElement) {
        console.error(
          '[Google Graph API Service] Unexpected response format:',
          response.data
        );
        return {
          entitiesData: [],
          error: 'Unexpected response format from Google Knowledge Graph API',
        };
      }

      const entitiesData = response.data.itemListElement
        .map((item: any) => {
          if (!item?.result) {
            return null;
          }
          const result = item.result;
          return {
            _id: result['@id'] || '',
            name: result.name || '',
            type: Array.isArray(result['@type'])
              ? result['@type'].join(', ')
              : '',
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
        })
        .filter(Boolean);

      return { entitiesData };
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(
          '[Google Graph API Service] Batch processing error:',
          error
        );
        batch.forEach((query) => {
          results.set(query, {
            entitiesData: [],
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        });
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
