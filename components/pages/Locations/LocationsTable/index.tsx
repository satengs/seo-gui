import React from 'react';
import { Button } from '@/components/ui/button';

const LocationsTable = () => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted">
          <tr>
            <th className="px-6 py-3">Competitor</th>
            <th className="px-6 py-3">Domain</th>
            <th className="px-6 py-3">Shared Keywords</th>
            <th className="px-6 py-3">Avg. Position</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-6 py-4">Example Corp</td>
            <td className="px-6 py-4">example.com</td>
            <td className="px-6 py-4">245</td>
            <td className="px-6 py-4">2.8</td>
            <td className="px-6 py-4">
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default LocationsTable;
