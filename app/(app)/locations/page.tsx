'use client';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pin } from 'lucide-react';
import PageInfoItem from '@/components/shared/PageInfoItem';
import NewLocationForm from '@/components/pages/Locations/NewLocationForm';
import LocationsTable from '@/components/pages/Locations/LocationsTable';
import axiosClient from '@/lib/axiosClient';
import { IKeywordPaginateParams, ILocation, ISortConfig } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Pagination from '@/components/pages/Keywords/KeywordsTable/Pagination';
import { SIZE } from '@/consts';

export default function LocationsPage() {
  const { toast } = useToast();
  const [showNewLocationForm, setShowNewLocationForm] =
    useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(30);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortBy, setSortBy] = useState<ISortConfig>();
  const onAddBtnClick = useCallback(() => {
    setShowNewLocationForm((prevState) => !prevState);
  }, []);

  const fetchLocations = useCallback(
    async (
      page: number,
      size: number = SIZE,
      searchKey: string = '',
      sortBy: ISortConfig = { sortKey: '', sortDirection: 'asc' }
    ) => {
      try {
        setFetchLoading(true);
        let queryString = `/api/locations?page=${page}`;
        if (size) {
          queryString += `&size=${size}`;
        }
        if (searchKey) {
          queryString += `&searchKey=${searchKey}`;
        }
        if (sortBy?.sortKey?.length) {
          queryString += `&sortKey=${sortBy?.sortKey}&sortDirection=${sortBy?.sortDirection}`;
        }
        const response = await axiosClient.get(queryString);
        if (response?.data?.entitiesData) {
          setLocations(response.data.entitiesData);
          setTotalCount(response.data.totalCount);
        }
      } catch (err) {
        setLocations([]);
        toast({
          title: 'Failed to fetch locations',
          description: '',
        });
      } finally {
        setFetchLoading(false);
      }
    },
    [toast]
  );

  const onLocationChange = useCallback((data: any) => {
    setLocations(data?.entitiesData);
    setTotalCount(data?.totalCount);
  }, []);

  const onLocationPageChange = useCallback(
    async ({ page = 1 }: IKeywordPaginateParams) => {
      await fetchLocations(page, itemsPerPage);
      setCurrentPage(page);
    },
    [fetchLocations, itemsPerPage]
  );

  const onItemPerPageChange = useCallback(
    (value: number) => setItemsPerPage(value),
    []
  );

  const onLocationFilterChange = useCallback(async (obj?: any) => {
    if (obj?.searchTerm || obj.searchTerm === '') {
      setSearchKey(obj?.searchTerm);
    }
    if (obj?.sortBy) {
      setSortBy({
        sortKey: obj?.sortBy.key,
        sortDirection: obj?.sortBy.direction,
      });
    }
  }, []);

  const handleSearchKeyChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchKey(e.target.value);
    },
    []
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchLocations(1, itemsPerPage, searchKey, sortBy);
  }, [fetchLocations, itemsPerPage, searchKey, sortBy]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Locations</h1>
        <Button onClick={onAddBtnClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PageInfoItem
          title={'Default Locations Count'}
          icon={<Pin className="text-primary" />}
          statistic={'15'}
        />
      </div>
      {showNewLocationForm ? (
        <NewLocationForm onNewLocation={onLocationChange} />
      ) : null}

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search locations..."
              className="w-full"
              type="search"
              onChange={handleSearchKeyChange}
              value={searchKey}
            />
          </div>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <LocationsTable
          locations={locations}
          fetchLoading={fetchLoading}
          currentPage={currentPage}
          onLocationChange={onLocationChange}
          onLocationFilterChange={onLocationFilterChange}
        />
        <Pagination
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={onLocationPageChange}
          onItemPerPageChange={onItemPerPageChange}
          itemsPerPage={itemsPerPage}
        />
      </Card>
    </div>
  );
}
