'use client';

import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LocationSelect from '@/components/shared/LocationSelect';
import { KeyRound, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DeviceSelect from '@/components/shared/DeviceSelect';
import KeywordsTable from '@/components/pages/Keywords/KeywordsTable';
import Pagination from '@/components/pages/Keywords/KeywordsTable/Pagination';
import axiosClient from '@/lib/axiosClient';
import { IKeyword } from '@/types';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<IKeyword[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [device, setDevice] = useState<string>('mobile');
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('');
  const { toast } = useToast();

  const fetchKeywords = useCallback(async (page: number = 1, size?: number) => {
    try {
      const response = await axiosClient.get(
        `/api/keywords?page=${page || 1}&size=${size || 10}`
      );
      setKeywords(response?.data?.entitiesData || []);
      setTotalCount(response?.data?.totalCount);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch keywords',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  async function searchKeywords() {
    try {
      if (!searchText?.length) {
        return;
      }
      setLoading(true);
      const reqBody = {
        term: searchText.trim(),
        location: location?.length ? location : 'United States',
        device,
      };
      const response = await axiosClient.post('/api/keywords/search', reqBody);
      setKeywords(response?.data?.keywords || []);
      setTotalCount(response?.data?.paginatedData?.totalCount);
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch keywords',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  const onDeviceSelect = useCallback((value: string) => setDevice(value), []);

  const onValueChange = useCallback((value: any) => {
    setLocation(value.name);
  }, []);
  const onKeywordsChange = useCallback((data: any) => {
    setKeywords(data?.entitiesData);
    setTotalCount(data?.totalCount);
  }, []);

  const onKeywordsPaginate = useCallback(
    async (page: number) => {
      await fetchKeywords(page);
    },
    [fetchKeywords]
  );

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Keywords</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Keywords
              </p>
              <h2 className="text-2xl font-bold">{totalCount || ''}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search keywords..."
              className="w-full"
              type="search"
              onChange={onInputChange}
            />
          </div>
          <div className="flex-1">
            <LocationSelect onValueChange={onValueChange} />
          </div>
          <div className="flex-0.5">
            <DeviceSelect onValue={onDeviceSelect} defaultValue={'mobile'} />
          </div>

          <Button variant="outline" onClick={searchKeywords} disabled={loading}>
            <Search
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Search:
          </Button>
        </div>
        {keywords?.length ? (
          <KeywordsTable
            keywords={keywords}
            onActionKeywordsChange={onKeywordsChange}
          />
        ) : (
          <p>...Loading keywords</p>
        )}
        <Pagination totalCount={totalCount} onPageChange={onKeywordsPaginate} />
      </Card>
    </div>
  );
}
