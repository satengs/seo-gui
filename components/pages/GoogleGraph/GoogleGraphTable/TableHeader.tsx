import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface TableHeaderProps {
  totalItems: number;
  selectedRows: number;
  onExportSelected: () => void;
  onExportAll: () => void;
  loading: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  totalItems,
  selectedRows,
  onExportSelected,
  onExportAll,
  loading,
}) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Google Graph Data</CardTitle>
        <div className="text-sm text-muted-foreground">
          {loading ? 'Loading...' : `Total: ${totalItems} items`}
        </div>
        <div className="flex items-center space-x-2">
          {selectedRows > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportSelected}
              disabled={loading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected ({selectedRows})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onExportAll}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default TableHeader;
