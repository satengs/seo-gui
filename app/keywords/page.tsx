"use client";

import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LocationSelect from '@/components/shared/LocationSelect';
import { KeyRound, Search, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DeviceSelect from '@/components/shared/DeviceSelect';
import KeywordsTable from './KeywordsTable';
import axiosClient from '@/lib/axiosClient';
import { IAccount, IKeyword } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import PageInfoItem from '@/components/shared/PageInfoItem';
import AccountInfoItem from '@/components/shared/AccountInfoItem';
import JobAction from '@/components/pages/Keywords/JobAction';
import { mockKeywords } from '@/lib/mockData';
import Pagination from '@/components/pages/Keywords/KeywordsTable/Pagination';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<IKeyword[] | null>(null);
  const [asDefault, setAsDefault] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [account, setAccount] = useState< IAccount>();
  const [device, setDevice] = useState<string>('mobile');
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('');
  const { toast } = useToast();

  const fetchKeywords = useCallback(async (page: number = 1, size?: number) => {
    try {
      const response = await axiosClient.get(
          `/api/keywords?page=${page || 1}&size=${size || 30}`
      );
      if (response?.data?.entitiesData) {
        setKeywords(response.data.entitiesData);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
      } else {
        // Fallback to mock data if no real data is available
        setKeywords(mockKeywords);
        setTotalCount(mockKeywords.length);
        setTotalPages(1);
        toast({
          title: 'Using Demo Data',
          description: 'Connected to demo environment',
        });
      }
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      // Fallback to mock data on error
      setKeywords(mockKeywords);
      setTotalCount(mockKeywords.length);
      setTotalPages(1);
      toast({
        title: 'Using Demo Data',
        description: 'Connected to demo environment',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchAccountData = useCallback(async () => {
    try {
      const response = await axiosClient.get('/api/account');
      setAccount(response?.data || {});
    } catch (err) {
      console.error('Failed to fetch account:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch account data',
        variant: 'destructive',
      });
    }
  }, [toast]);

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
        isDefaultKeywords: asDefault,
      };
      const response = await axiosClient.post('/api/keywords/search', reqBody);
      setKeywords(response?.data?.entitiesData || []);
      setTotalCount(response?.data?.totalCount);
      setTotalPages(response?.data?.totalPages);
      toast({
        title: 'Success',
        description: 'Keywords searched successfully',
      });
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
      // Return mock data filtered by search term
      const filteredMockData = mockKeywords.filter(k =>
          k.term.toLowerCase().includes(searchText.toLowerCase())
      );
      setKeywords(filteredMockData);
      setTotalCount(filteredMockData.length);
      setTotalPages(1);
      toast({
        title: 'Using Demo Data',
        description: 'Connected to demo environment',
      });
    } finally {
      setLoading(false);
    }
  }

  const onInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSearchText(e.target.value);
  };

  const onDeviceSelect = useCallback((value: string) => setDevice(value), []);

  const onValueChange = useCallback((value: any) => {
    setLocation(value);
  }, []);

  const onKeywordsChange = useCallback((data: any) => {
    setKeywords(data?.entitiesData);
    setTotalCount(data?.totalCount);
    setTotalPages(data?.totalPages);
  }, []);

  const onKeywordsPaginate = useCallback(
      async (page: number) => {
        await fetchKeywords(page);
        setCurrentPage(page);
      },
      [fetchKeywords]
  );

  const onSwitchToggle = useCallback(() => {
    setAsDefault((prevState) => !prevState);
  }, []);

  useEffect(() => {
    fetchKeywords();
    fetchAccountData();
  }, [fetchKeywords, fetchAccountData]);

  return (
      <div className="p-1.5 space-y-6">
        {/*<div className="flex justify-between items-center">*/}
        {/*  <h1 className="text-2xl font-bold">Keywords</h1>*/}
        {/*  /!*{account && <AccountInfoItem account={account} />}*!/*/}
        {/*</div>*/}

        {/*<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">*/}
        {/*  <PageInfoItem*/}
        {/*      title={'Total Keywords'}*/}
        {/*      icon={<KeyRound className="h-5 w-5 text-primary" />}*/}
        {/*      statistic={totalCount}*/}
        {/*  />*/}
        {/*</div>*/}

        <Card className="px-6">
          <JobAction />
          <div className="flex items-center bg-fuchsia-50 rounded-md shadow-lg px-3 py-2 mb-6">
            <Info className="text-primary bg-blue-95 dark:text-blue-17 opacity-60" />
            <span className="ml-2 text-blue-95 text-center px-3 dark:text-blue-17 opacity-60">
            Note: Daily data is collected only for default keywords.
          </span>
          </div>
          <div>
            <p className="text-sm text-gray-800 dark:text-blue-50 opacity-70 my-2 px-2">
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

              <div className="mt-4 flex items-center">
                <Switch
                    onCheckedChange={onSwitchToggle}
                    checked={asDefault}
                    id="default-toggle"
                />
                <label
                    className="ml-2 text-blue-95 text-center text-sm opacity-60 cursor-pointer"
                    htmlFor="default-toggle"
                >
                  Set as default
                </label>
              </div>
            </div>
            <div className="flex-0.5">
              <DeviceSelect onValue={onDeviceSelect} defaultValue="mobile" />
            </div>

            <Button variant="outline" onClick={searchKeywords} disabled={loading}>
              <Search className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Search
            </Button>
          </div>
          {keywords?.length ? (
              <KeywordsTable
                  keywords={keywords}
                  onActionKeywordsChange={onKeywordsChange}
                  currentPage={currentPage}
                  totalCount={totalCount}
                  totalPages={totalPages}
              />
          ) : (
              <p>...Loading keywords</p>
          )}
          <Pagination
              totalCount={totalCount}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onKeywordsPaginate}
          />
        </Card>
      </div>
  );
}