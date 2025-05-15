'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Pagination from '@/components/pages/Keywords/KeywordsTable/Pagination';
import { csvParser } from '@/utils';
import TableHeaderComponent from '@/components/pages/GoogleGraph/GoogleGraphTable/TableHeader';
import SearchBar from '@/components/pages/GoogleGraph/GoogleGraphTable/SearchBar';
import DataTable from '@/components/pages/GoogleGraph/GoogleGraphTable/DataTable';
import DataViewModal from '@/components/pages/GoogleGraph/GoogleGraphTable/DataViewModal';
import { AlertCircle } from 'lucide-react';

interface GoogleGraphTableProps {
  data: any[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
  fetchLoading: boolean;
  pageSize: number;
  onPageChange: (data: { page?: number }) => void;
}

interface Keyword {
  _id: string;
  term: string;
  location: string;
  device: string;
}

const CSV_FIELDS = ['_id', 'keywordId', 'term', 'createdAt', 'data'];

const GoogleGraphTable: React.FC<GoogleGraphTableProps> = ({
  data: initialData = [],
  currentPage,
  onPageChange,
}) => {
  const [data, setData] = useState<any[]>(initialData);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [rowData, setRowData] = useState<Record<string, any[]>>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [historicalData, setHistoricalData] = useState<Record<string, any[]>>({});
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: '', direction: 'asc' });
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combined data fetching effect
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      try {
        // First try to fetch graph data
        const response = await axios.get('/api/google-graph', {
          params: { latest: true },
        });

        if (!isMounted) return;

        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setData(response.data.data);
          setLoading(false);
          return;
        }

        // If no graph data, fetch keywords
        const { data: keywordsData } = await axios.get('/api/keywords', {
          params: { fullList: true },
        });

        if (!isMounted) return;
        
        const transformedKeywords = keywordsData.map((keyword: Keyword) => ({
          _id: keyword._id,
          keywordId: keyword._id,
          term: keyword.term,
          createdAt: new Date(),
          data: [],
          location: keyword.location,
          device: keyword.device,
          status: 'No Graph Data'
        }));
        setData(transformedKeywords);
      } catch (error: any) {
        if (!isMounted) return;

        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch data';
        setError(errorMessage);
        setData([]);

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we only want to fetch once on mount

  // Fetch row data
  useEffect(() => {
    const fetchRowData = async () => {
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
    };
    fetchRowData();
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        row.term.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (sortConfig.key === 'itemsCount') {
          aValue = rowData[a._id]?.length || 0;
          bValue = rowData[b._id]?.length || 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, searchTerm, sortConfig, rowData]);

  // Paginate data
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  // Handlers
  const handleItemPerPageChange = useCallback(
    (value: number) => {
      setItemsPerPage(value);
      onPageChange({ page: 1 });
    },
    [onPageChange]
  );

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleSearch = useCallback(() => {
    setSearchTerm(searchInput);
    onPageChange({ page: 1 });
  }, [searchInput, onPageChange]);

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
        checked ? new Set(paginatedRows.map((row) => row._id)) : new Set()
      );
    },
    [paginatedRows]
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
    const selected = data.filter((row) => selectedRows.has(row._id));
    if (!selected.length) {
      toast({ title: 'No rows selected', variant: 'destructive' });
      return;
    }
    const allHistory = (
      await Promise.all(
        selected.map(async (row) => {
          try {
            const { data: json } = await axios.get('/api/google-graph', {
              params: { keywordId: row.keywordId, limit: 100 },
            });
            return Array.isArray(json.data) ? json.data : [];
          } catch {
            return [];
          }
        })
      )
    ).flat();
    if (!allHistory.length) {
      toast({
        title: 'No historical data found for selected',
        variant: 'destructive',
      });
      return;
    }
    exportToCsv(allHistory);
  }, [data, selectedRows, exportToCsv, toast]);

  const handleExportAllHistorical = useCallback(async () => {
    try {
      const { data: json } = await axios.get('/api/google-graph', {
        params: { limit: 1000 },
      });
      if (!json.data?.length) {
        toast({ title: 'No historical data found', variant: 'destructive' });
        return;
      }
      exportToCsv(json.data);
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to export historical data',
        variant: 'destructive',
      });
    }
  }, [exportToCsv, toast]);

  return (
    <div className="mx-1 py-3 md:w-[820px] xl:w-[1400px] 3xl:w-full">
      <Card className="bg-opacity-5 bg-gray-200">
        <TableHeaderComponent
          totalItems={filteredAndSortedData.length}
          selectedRows={selectedRows.size}
          onExportSelected={handleExportSelected}
          onExportAll={handleExportAllHistorical}
          loading={loading}
        />
        <CardContent>
          <SearchBar
            searchInput={searchInput}
            onSearchInputChange={setSearchInput}
            onSearch={handleSearch}
          />

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8 text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          ) : (
            <DataTable
              data={paginatedRows}
              selectedRows={selectedRows}
              rowData={rowData}
              onSort={handleSort}
              onSelectRow={handleSelectRow}
              onSelectAll={handleSelectAll}
            />
          )}

          <Pagination
            totalCount={filteredAndSortedData.length}
            currentPage={currentPage}
            onPageChange={onPageChange}
            onItemPerPageChange={handleItemPerPageChange}
            itemsPerPage={itemsPerPage}
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
