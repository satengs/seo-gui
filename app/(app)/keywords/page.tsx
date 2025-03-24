'use client';

import React, { useEffect, useState, ChangeEvent, useCallback } from 'react';
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
import { SIZE } from '@/consts';
import { IKeyword, IKeywordPaginateParams, ISortConfig } from '@/types';
import { DateRange } from 'react-day-picker';
import DateFilter from '@/components/pages/Keywords/DateFilter';

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<IKeyword[] | null>(null);
  const [asDefault, setAsDefault] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(30);
  const [searchText, setSearchText] = useState<string>('');
  const [device, setDevice] = useState<string>('mobile');
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortBy, setSortBy] = useState<ISortConfig>();
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);

  const { toast } = useToast();

  const fetchKeywords = useCallback(
    async (
      page: number = 1,
      size: number = SIZE,
      searchTerm: string = '',
      sortBy: ISortConfig = { sortKey: '', sortDirection: 'asc' },
      dateRange: DateRange | undefined
    ) => {
      try {
        setFetchLoading(true);
        let queryString = `/api/keywords?page=${page}`;
        if (size) {
          queryString += `&size=${size}`;
        }
        if (searchTerm) {
          queryString += `&searchTerm=${searchTerm}`;
        }
        if (sortBy?.sortKey?.length) {
          queryString += `&sortKey=${sortBy?.sortKey}&sortDirection=${sortBy?.sortDirection}`;
        }
        if (dateRange?.from && dateRange?.to) {
          queryString += `&dateFrom=${dateRange?.from}&dateTo=${dateRange?.to}`;
        }

        const response = await axiosClient.get(queryString);
        if (response?.data?.entitiesData) {
          setKeywords(response.data.entitiesData);
          setTotalCount(response.data.totalCount);
          // setTotalPages(5);
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
        setFetchLoading(false);
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
      setSearchText('');
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

  const onDateRangeChange = useCallback(
    (start: Date | undefined, end: Date | undefined) =>
      setDateRange({ from: start, to: end }),
    []
  );

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

  const onKeywordFilterChange = useCallback(async (obj?: any) => {
    if (obj?.searchTerm || obj.searchTerm === '') {
      setSearchTerm(obj?.searchTerm);
    }
    if (obj?.sortBy) {
      setSortBy({
        sortKey: obj?.sortBy.key,
        sortDirection: obj?.sortBy.direction,
      });
    }
  }, []);

  const onItemPerPageChange = useCallback(
    (value: number) => setItemsPerPage(value),
    []
  );

  const onKeywordsPaginate = useCallback(
    async ({ page = 1 }: IKeywordPaginateParams) => {
      await fetchKeywords(page, itemsPerPage, searchTerm, sortBy, dateRange);
      setCurrentPage(page);
    },
    [fetchKeywords, searchTerm, sortBy, dateRange, itemsPerPage]
  );

  const onSwitchToggle = useCallback(() => {
    setAsDefault((prevState) => !prevState);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    // (async function () {
    //   const resp = await axiosClient.get('/api/keywords/test');
    //   console.log('resp: ', resp);
    // })();
    fetchKeywords(1, itemsPerPage, searchTerm, sortBy, dateRange);
  }, [fetchKeywords, searchTerm, sortBy, dateRange, itemsPerPage]);

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
                placeholder="Add keyword(s)..."
                className="w-full"
                onChange={onInputChange}
                value={searchText}
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
        <DateFilter onDateFilterChange={onDateRangeChange} />
        <KeywordsTable
          keywords={keywords}
          onActionKeywordsChange={onKeywordsChange}
          onKeywordFilterChange={onKeywordFilterChange}
          currentPage={currentPage}
          totalCount={totalCount}
          totalPages={totalPages}
          onKeywordsPaginate={onKeywordsPaginate}
          fetchLoading={fetchLoading}
        />
        <Pagination
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={onKeywordsPaginate}
          onItemPerPageChange={onItemPerPageChange}
          itemsPerPage={itemsPerPage}
        />
      </Card>
    </div>
  );
}
