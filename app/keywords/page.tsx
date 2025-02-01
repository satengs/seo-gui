'use client';

import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LocationSelect from '@/components/shared/LocationSelect';
import { KeyRound, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DeviceSelect from '@/components/shared/DeviceSelect';
import KeywordsTable from '@/components/pages/Keywords/KeywordsTable';
import { Info } from 'lucide-react';
import Pagination from '@/components/pages/Keywords/KeywordsTable/Pagination';
import axiosClient from '@/lib/axiosClient';
import { IKeyword } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import PageInfoItem from '@/components/shared/PageInfoItem';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<IKeyword[] | null>(null);
  const [asDefault, setAsDefault] = useState<boolean>(false);
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
      console.log('search text: ', searchText);
      setLoading(true);
      const reqBody = {
        term: searchText.trim(),
        location: location?.length ? location : 'United States',
        device,
        isDefaultKeywords: asDefault,
      };
      const response = await axiosClient.post('/api/keywords/search', reqBody);
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
  }

  function onInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
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

  const onSwitchToggle = useCallback(() => {
    setAsDefault((prevState) => !prevState);
  }, []);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Keywords</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <PageInfoItem
          title={'Total Keywords'}
          icon={<KeyRound className="h-5 w-5 text-primary" />}
          statistic={totalCount}
        />
      </div>

      <Card className="p-6">
        <div
          className={
            'flex items-center bg-fuchsia-50 rounded-md shadow-lg px-3 py-2 mb-6'
          }
        >
          <Info className=" text-primary bg-blue-95 opacity-60" />
          <span className={'ml-2 text-blue-95 text-center px-3  opacity-60'}>
            Note: Daily data is collected only for default keywords.
          </span>
        </div>
        <div>
          <p className={'text-sm text-gray-800 opacity-70 my-2 px-2'}>
            Enter keywords (one per line)
          </p>
        </div>
        <div className="flex gap-3 mb-2">
          <div className="flex-1">
            <div>
              <Textarea
                placeholder="Search keywords..."
                className="w-full"
                onChange={onInputChange}
              />
            </div>
          </div>
          <div className="flex-1">
            <LocationSelect onValueChange={onValueChange} />

            <div className={'mt-4 flex items-center'}>
              <Switch
                onCheckedChange={onSwitchToggle}
                checked={asDefault}
                id={'default-toggle'}
              />
              <label
                className={
                  'ml-2 text-blue-95 text-center text-sm opacity-60 cursor-pointer'
                }
                htmlFor="default-toggle"
              >
                Set as default
              </label>
            </div>
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
