import React, { useCallback, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import LocationItemActions from './LocationItemActions';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { ILocation } from '@/types';

interface ILocationsTableProps {
  locations: ILocation[];
  fetchLoading: boolean;
  currentPage: number;
  searchKey: string;
  onLocationChange: (date: any) => void;
  onLocationFilterChange: (date: any) => void;
}

const LocationsTable = ({
  locations,
  fetchLoading,
  currentPage,
  searchKey,
  onLocationChange,
  onLocationFilterChange,
}: ILocationsTableProps) => {
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'asc',
  });

  const locationTableCols = useMemo(
    () => [
      {
        id: 'location',
        label: 'Location',
      },
      {
        id: 'countryCode',
        label: 'Country Code',
      },
      {
        id: 'longitude',
        label: 'Longitude',
      },
      {
        id: 'latitude',
        label: 'Latitude',
      },
      {
        id: 'actions',
        label: 'Actions',
      },
    ],
    []
  );

  const handleSort = useCallback(
    async (key: string) => {
      let direction = 'asc';
      setSortConfig((prev) => {
        direction =
          prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
        return {
          key,
          direction:
            prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        };
      });
      onLocationFilterChange({
        sortBy: { key, direction },
      });
    },
    [onLocationFilterChange]
  );

  return (
    <div className="relative overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {locationTableCols.map((col) => (
              <React.Fragment key={col.id}>
                {col.id === 'actions' ? (
                  <TableHead key={col.id}>{col.label}</TableHead>
                ) : (
                  <TableHead key={col.id}>
                    <Button variant="ghost" onClick={() => handleSort(col.id)}>
                      {col.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                )}
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-md">
          {!fetchLoading ? (
            locations.map((item) => {
              return (
                <TableRow key={item._id}>
                  {locationTableCols.map((col) => (
                    <React.Fragment key={`${col.id}-${item._id}`}>
                      {col.id !== 'actions' ? (
                        <TableCell className="justify-items-center text-xs font-medium py-4">
                          <span title={item.location}>
                            {item?.[`${col.id}`] || ''}
                          </span>
                        </TableCell>
                      ) : (
                        <TableCell>
                          <div className="flex flex-row align-center justify-center">
                            <LocationItemActions
                              location={item}
                              currentPage={currentPage}
                              onLocationChange={onLocationChange}
                              searchKey={searchKey}
                              sortBy={{
                                sortKey: sortConfig.key,
                                sortDirection: sortConfig.direction,
                              }}
                            />
                          </div>
                        </TableCell>
                      )}
                    </React.Fragment>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={11}>
                <p className={'py-3 font-medium'}>Loading locations . . .</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LocationsTable;
