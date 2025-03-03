'use client';

import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Search, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import LocationSelect from '@/components/shared/LocationSelect';
import DeviceSelect from '@/components/shared/DeviceSelect';
import KeywordsTable from '@/components/pages/Keywords/KeywordsTable';
import JobAction from '@/components/pages/Keywords/JobAction';
import Pagination from '@/components/pages/Keywords/KeywordsTable/Pagination';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { mockKeywords } from '@/lib/mockData';
import { IKeyword } from '@/types';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<IKeyword[] | null>(null);
  const [asDefault, setAsDefault] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [device, setDevice] = useState<string>('mobile');
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('');
  const { toast } = useToast();

  const fetchKeywords = useCallback(
    async (page: number = 1, size?: number) => {
      try {
        const response = await axiosClient.get(
          `/api/keywords?page=${page || 1}&size=${size || 30}`
        );
        if (response?.data?.entitiesData) {
          setKeywords(response.data.entitiesData);
          setTotalCount(response.data.totalCount);
          setTotalPages(5);
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
    },
    [toast]
  );

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
      const filteredMockData = mockKeywords.filter((k) =>
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
  }, [fetchKeywords]);

  return (
    <div className="p-1.5 space-y-6">
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
            <Search
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
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
          currentPage={currentPage}
          onPageChange={onKeywordsPaginate}
        />
      </Card>
    </div>
  );
}
