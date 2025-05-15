import React, { useMemo } from 'react';
import { INewLocation } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import LocationItemActions from './LocationItemActions';

interface ILocationsTableProps {
  locations: INewLocation[];
  fetchLoading: boolean;
  currentPage: number;
  onLocationChange: (date: any) => void;
}

const LocationsTable = ({
  locations,
  fetchLoading,
  currentPage,
  onLocationChange,
}: ILocationsTableProps) => {
  const locationTableCols = useMemo(
    () => [
      {
        id: 'location',
        label: 'Location',
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
  return (
    <div className="relative overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {locationTableCols.map((col) => (
              <TableHead key={col.id}>{col.label}</TableHead>
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
                          <span title={item.location}>{item[col.id]}</span>
                        </TableCell>
                      ) : (
                        <TableCell>
                          <div
                            className={
                              'flex flex-row align-center justify-center'
                            }
                          >
                            <LocationItemActions
                              location={item}
                              currentPage={currentPage}
                              onLocationChange={onLocationChange}
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
      {/*<table className="w-full text-sm text-left">*/}
      {/*  <thead className="text-xs uppercase bg-muted">*/}
      {/*    <tr>*/}
      {/*      <th className="px-6 py-3">Location</th>*/}
      {/*      <th className="px-6 py-3">Longitude</th>*/}
      {/*      <th className="px-6 py-3">Latitude</th>*/}
      {/*      <th className="px-6 py-3">Actions</th>*/}
      {/*    </tr>*/}
      {/*  </thead>*/}
      {/*  <tbody>*/}
      {/*    {locations.map((item) => (*/}
      {/*      <tr key={item._id} className="border-b">*/}
      {/*        <td className="px-6 py-4">{item.location}</td>*/}
      {/*        <td className="px-6 py-4">{item.longitude}</td>*/}
      {/*        <td className="px-6 py-4">{item.latitude}</td>*/}
      {/*        {*/}
      {/*          */}
      {/*        }*/}
      {/*        <td className="px-6 py-4">2.8</td>*/}
      {/*        <td className="px-6 py-4">*/}
      {/*          <Button variant="ghost" size="sm">*/}
      {/*            View Details*/}
      {/*          </Button>*/}
      {/*        </td>*/}
      {/*      </tr>*/}
      {/*    ))}*/}

      {/*    /!* Add more rows as needed *!/*/}
      {/*  </tbody>*/}
      {/*</table>*/}
    </div>
  );
};

export default LocationsTable;
