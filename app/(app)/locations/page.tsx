'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pin } from 'lucide-react';
import PageInfoItem from '@/components/shared/PageInfoItem';
import NewLocationForm from '@/components/pages/Locations/NewLocationForm';
import LocationsTable from '@/components/pages/Locations/LocationsTable';
import axiosClient from '@/lib/axiosClient';
import { mockKeywords } from '@/lib/mockData';
import { ILocation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Pagination from '@/components/pages/Keywords/KeywordsTable/Pagination';

export default function LocationsPage() {
  const { toast } = useToast();
  const [showNewLocationForm, setShowNewLocationForm] =
    useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(30);
  const onAddBtnClick = useCallback(() => {
    setShowNewLocationForm((prevState) => !prevState);
  }, []);

  const fetchLocations = useCallback(
    async (page: number, size: number) => {
      try {
        setFetchLoading(true);
        let queryString = `/api/locations?page=${page}`;
        if (size) {
          queryString += `&size=${size}`;
        }
        const response = await axiosClient.get(queryString);
        if (response?.data?.entitiesData) {
          setLocations(response.data.entitiesData);
          setTotalCount(response.data.totalCount);
        }
      } catch (err) {
        setLocations([]);
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

  const onLocationChange = useCallback((data: any) => {
    setLocations(data?.entitiesData);
    setTotalCount(data?.totalCount);
    setTotalPages(data?.totalPages);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchLocations(1, itemsPerPage);
  }, [itemsPerPage]);

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
          title={'Total Locations'}
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
        />
        <Pagination
          totalCount={totalCount}
          currentPage={currentPage}
          // onPageChange={onKeywordsPaginate}
          // onItemPerPageChange={onItemPerPageChange}
          itemsPerPage={itemsPerPage}
        />
      </Card>
    </div>
  );
}
