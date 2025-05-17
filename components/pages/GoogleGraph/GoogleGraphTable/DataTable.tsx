import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown } from 'lucide-react';

interface DataTableProps {
  data: any[];
  selectedRows: Set<string>;
  rowData: Record<string, any[]>;
  onSort: (key: string) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  loading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  selectedRows,
  rowData,
  onSort,
  onSelectRow,
  onSelectAll,
  sortConfig,
  loading = false,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]">
              <Checkbox
                checked={selectedRows.size === data.length}
                onCheckedChange={onSelectAll}
                disabled={loading}
              />
            </TableHead>
            <TableHead className="w-[300px]">
              <Button
                variant="ghost"
                onClick={() => onSort('term')}
                disabled={loading}
              >
                Keyword
                <ArrowUpDown
                  className={`ml-2 h-4 w-4 ${sortConfig.key === 'term' ? 'text-primary' : ''}`}
                />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('createdAt')}
                disabled={loading}
              >
                Updated At
                <ArrowUpDown
                  className={`ml-2 h-4 w-4 ${sortConfig.key === 'createdAt' ? 'text-primary' : ''}`}
                />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => onSort('itemsCount')}
                disabled={loading}
              >
                Items Count
                <ArrowUpDown
                  className={`ml-2 h-4 w-4 ${sortConfig.key === 'itemsCount' ? 'text-primary' : ''}`}
                />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading ? (
            data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(row._id)}
                      onCheckedChange={(checked) =>
                        onSelectRow(row._id, checked as boolean)
                      }
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{row.term}</TableCell>
                  <TableCell className="text-center">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {rowData[row._id]?.length || 0}
                  </TableCell>
                </TableRow>
              ))
            )
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <p className="py-3 font-medium">Loading data . . .</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
