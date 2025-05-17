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
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  selectedRows,
  rowData,
  onSort,
  onSelectRow,
  onSelectAll,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedRows.size === data.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('term')}>
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('createdAt')}>
                Last Updated
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort('itemsCount')}>
                Items count
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.has(row._id)}
                  onCheckedChange={(checked) => onSelectRow(row._id, !!checked)}
                />
              </TableCell>
              <TableCell>{row.term}</TableCell>
              <TableCell>
                {new Date(row.createdAt).toLocaleDateString('en-US')}
              </TableCell>
              <TableCell>{rowData[row._id]?.length || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
