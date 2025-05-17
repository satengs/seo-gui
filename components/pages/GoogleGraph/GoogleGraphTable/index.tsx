'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Pagination from '@/components/pages/Keywords/KeywordsTable/Pagination';
import { csvParser } from '@/utils';
import TableHeaderComponent from '@/components/pages/GoogleGraph/GoogleGraphTable/TableHeader';
import DataTable from '@/components/pages/GoogleGraph/GoogleGraphTable/DataTable';
import DataViewModal from '@/components/pages/GoogleGraph/GoogleGraphTable/DataViewModal';
import { AlertCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GoogleGraphTableProps {
  data: any[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
  fetchLoading: boolean;
  pageSize: number;
  onPageChange: (params: { page?: number }) => void;
  onItemPerPageChange: (value: number) => void;
  onSort: (key: string) => void;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}


const CSV_FIELDS = ['_id', 'keywordId', 'term', 'createdAt', 'data'];

const GoogleGraphTable: React.FC<GoogleGraphTableProps> = ({
  data: initialData = [],
  currentPage,
  totalCount,
  fetchLoading,
  pageSize,
  onPageChange,
  onItemPerPageChange,
  onSort,
  sortConfig,
  searchTerm,
  onSearchChange,
  onSearch
}) => {
  const [data, setData] = useState<any[]>(initialData);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [rowData, setRowData] = useState<Record<string, any[]>>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [historicalData, setHistoricalData] = useState<Record<string, any[]>>({});
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Fetch row data
  useEffect(() => {
    const fetchRowData = async () => {
      if (fetchLoading) return; // Don't fetch if parent is loading

      try {
        const newRowData: Record<string, any[]> = {};
        await Promise.all(
          data.map(async (row) => {
            try {
              const { data: json } = await axios.get('/api/google-graph', {
                params: {
                  keywordId: row.keywordId,
                  limit: 1,
                },
              });
              if (json.data?.[0]?.data) {
                newRowData[row._id] = json.data[0].data;
              }
            } catch (e) {
              console.error('Error fetching row data:', e);
            }
          })
        );
        setRowData(newRowData);
      } catch (error) {
        console.error('Error in fetchRowData:', error);
      }
    };

    if (data.length > 0) {
      fetchRowData();
    }
  }, [data, fetchLoading]);

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedRows(
        checked ? new Set(data.map((row) => row._id)) : new Set()
      );
    },
    [data]
  );

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!showModal || selectedRows.size === 0) return;
      setLoadingHistory(true);
      const newHistoricalData: Record<string, any[]> = {};
      await Promise.all(
        Array.from(selectedRows).map(async (rowId) => {
          const row = data.find((r) => r._id === rowId);
          if (!row) return;
          try {
            const { data: json } = await axios.get('/api/google-graph', {
              params: {
                keywordId: row.keywordId,
                limit: 100,
              },
            });
            newHistoricalData[row._id] = json.data;
          } catch (e) {
            console.error('Error fetching historical data:', e);
            newHistoricalData[row._id] = [];
          }
        })
      );
      setHistoricalData(newHistoricalData);
      setLoadingHistory(false);
    };
    fetchHistoricalData();
  }, [showModal, selectedRows, data]);

  const selectedRowsData = data.filter((row) => selectedRows.has(row._id));

  const exportToCsv = useCallback(
    (rows: any[], filename = 'google-graph-data.csv') => {
      if (!rows.length) return;
      const csvRows = [CSV_FIELDS.join(',')];
      for (const row of rows) {
        const values = CSV_FIELDS.map((field) => {
          let value = row[field];
          if (field === 'createdAt') value = new Date(value).toLocaleString();
          if (field === 'data')
            value = typeof value === 'object' ? JSON.stringify(value) : value;
          if (typeof value === 'string')
            value = '"' + value.replace(/"/g, '""') + '"';
          return value;
        });
        csvRows.push(values.join(','));
      }

      csvParser(csvRows.join('\n'), filename);
    },
    []
  );

  const handleExportSelected = useCallback(async () => {
    if (selectedRows.size === 0) {
      toast({
        title: 'No rows selected',
        description: 'Please select at least one row to export',
        variant: 'destructive'
      });
      return;
    }

    try {
      const selectedData = data.filter(row => selectedRows.has(row._id));
      if (selectedData.length === 0) {
        toast({
          title: 'Export failed',
          description: 'No data found for selected rows',
          variant: 'destructive'
        });
        return;
      }
      exportToCsv(selectedData, `google-graph-selected-${new Date().toISOString()}.csv`);
      toast({
        title: 'Export successful',
        description: `Exported ${selectedData.length} rows to CSV`
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export selected data',
        variant: 'destructive'
      });
    }
  }, [data, selectedRows, exportToCsv, toast]);

  const handleExportAllHistorical = useCallback(async () => {
    try {
      const { data: json } = await axios.get('/api/google-graph', {
        params: { limit: 1000 }
      });

      if (!json.data?.length) {
        toast({
          title: 'No data available',
          description: 'There is no data to export',
          variant: 'destructive'
        });
        return;
      }

      exportToCsv(json.data, `google-graph-all-${new Date().toISOString()}.csv`);
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export all data',
        variant: 'destructive'
      });
    }
  }, [exportToCsv, toast]);

  return (
    <div className="mt-4">
      <Card className="bg-opacity-5 bg-gray-200">
        <TableHeaderComponent
          totalItems={totalCount}
          selectedRows={selectedRows.size}
          onExportSelected={handleExportSelected}
          onExportAll={handleExportAllHistorical}
          loading={fetchLoading}
        />
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="max-w-sm"
              />
              <Button variant="outline" onClick={onSearch}>
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <DataTable
            data={data}
            selectedRows={selectedRows}
            rowData={rowData}
            onSort={onSort}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            sortConfig={sortConfig}
            loading={fetchLoading}
          />

          <Pagination
            totalCount={totalCount}
            currentPage={currentPage}
            onPageChange={onPageChange}
            onItemPerPageChange={onItemPerPageChange}
            itemsPerPage={pageSize}
          />

          {selectedRows.size > 0 && (
            <div className="fixed right-0 top-1/2 flex flex-col gap-2 transform -translate-y-1/2 z-50">
              <Button
                variant="secondary"
                className="text-white bg-sky-400 border-[1px] rounded-l-3xl rounded-r-none hover:bg-gray-500 border-red-800 h-auto py-3 px-4"
                onClick={() => setShowModal(true)}
              >
                View Data
              </Button>
            </div>
          )}

          <DataViewModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            selectedRowsData={selectedRowsData}
            historicalData={historicalData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleGraphTable;
