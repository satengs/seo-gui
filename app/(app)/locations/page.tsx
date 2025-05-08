'use client';
import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pin } from 'lucide-react';
import PageInfoItem from '@/components/shared/PageInfoItem';
import NewLocationForm from '@/components/pages/Locations/NewLocationForm';
import LocationsTable from '@/components/pages/Locations/LocationsTable';

export default function LocationsPage() {
  const [showNewLocationForm, setShowNewLocationForm] =
    useState<boolean>(false);

  const onAddBtnClick = useCallback(() => {
    setShowNewLocationForm((prevState) => !prevState);
  }, []);

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
      {showNewLocationForm ? <NewLocationForm /> : null}

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search competitors..."
              className="w-full"
              type="search"
            />
          </div>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <LocationsTable />
      </Card>
    </div>
  );
}
