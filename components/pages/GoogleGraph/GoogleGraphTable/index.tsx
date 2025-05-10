'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Download,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Pagination from '@/components/pages/Keywords/KeywordsTable/Pagination';
import JsonViewer from '@/components/pages/Keywords/DifferenceModal/JsonViewer';
import Modal from '@/components/shared/Modal';
import { generateCsvFile } from '@/utils';
import axios from 'axios';
import { csvParser } from '../../../../utils/index';

interface GoogleGraphTableProps {
  data: any[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
  fetchLoading: boolean;
  pageSize: number;
  onPageChange: (data: { page?: number }) => void;
}

const GoogleGraphTable: React.FC<GoogleGraphTableProps> = ({
  data: initialData = [],
  currentPage,
  onPageChange,
}) => {
  const [data, setData] = useState<any[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [historicalData, setHistoricalData] = useState<Record<string, any[]>>({});
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [checking, setChecking] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Record<string, string | null>>({});
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: '', direction: 'asc' });
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch latest keyword data from the new endpoint
    const fetchLatest = async () => {
      try {
        const { data: json } = await axios.get('/api/google-graph', {
          params: { latest: true }
        });
        setData(json.data || []);
      } catch (error) {
        console.error('Error fetching latest data:', error);
      }
    };
    fetchLatest();
  }, []);

  // Filtering and sorting logic
  const filteredAndSortedData = useMemo(() => {
    let filtered = data;
    if (searchTerm) {
      filtered = filtered.filter(row =>
        row.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.keywordId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else {
          aValue = aValue?.toString().toLowerCase() || '';
          bValue = bValue?.toString().toLowerCase() || '';
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, searchTerm, sortConfig]);

  // Pagination logic (client-side for now)
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const handleItemPerPageChange = (value: number) => {
    setItemsPerPage(value);
    onPageChange({ page: 1 });
  };

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => {
      const direction = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  }, []);

  const handleSearch = useCallback(() => {
    setSearchTerm(searchInput);
    onPageChange({ page: 1 });
  }, [searchInput, onPageChange]);

  // Fetch historical data for selected rows when modal opens
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
                limit: 100
              }
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
  }, [showModal]);

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedRows.map((row) => row._id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const selectedRowsData = data.filter((row) => selectedRows.has(row._id));

  // Local CSV export function for selected fields
  const exportToCsv = (rows: any[], filename = 'google-graph-data.csv') => {
    if (!rows.length) return;
    const fields = ['_id', 'keywordId', 'term', 'createdAt', 'data'];
    const csvRows = [fields.join(',')];
    rows.forEach(row => {
      const values = fields.map(field => {
        let value = row[field];
        if (field === 'createdAt') {
          value = new Date(value).toLocaleString();
        }
        if (field === 'data') {
          value = typeof value === 'object' ? JSON.stringify(value) : value;
        }
        // Escape quotes and commas
        if (typeof value === 'string') {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvRows.push(values.join(','));
    });
    const csvContent = csvRows.join('\n');
    const result = csvParser(csvContent, filename);
    return result;
  };

  const handleExportSelected = async () => {
    const selected = data.filter((row) => selectedRows.has(row._id));
    if (selected.length === 0) {
      toast({ title: 'No rows selected', variant: 'destructive' });
      return;
    }
    // Fetch history for each selected keywordId
    const allHistory = (
      await Promise.all(
        selected.map(async (row) => {
          try {
            const { data: json } = await axios.get('/api/google-graph', {
              params: {
                keywordId: row.keywordId,
                limit: 100
              }
            });
            return Array.isArray(json.data) ? json.data : [];
          } catch (error) {
            console.error('Error fetching data for keyword:', row.keywordId, error);
            return [];
          }
        })
      )
    ).flat();
    if (allHistory.length === 0) {
      toast({ title: 'No historical data found for selected', variant: 'destructive' });
      return;
    }
    exportToCsv(allHistory);
  };

  const handleExportAllHistorical = async () => {
    try {
      const { data: json } = await axios.get('/api/google-graph', {
        params: { limit: 1000 }
      });
      if (!json.data || !Array.isArray(json.data) || json.data.length === 0) {
        toast({ title: 'No historical data found', variant: 'destructive' });
        return;
      }
      exportToCsv(json.data);
    } catch (e) {
      console.error('Error exporting historical data:', e);
      toast({ title: 'Error', description: 'Failed to export historical data', variant: 'destructive' });
    }
  };

  return (
    <div className="mx-1 py-3 md:w-[820px] xl:w-[1400px] 3xl:w-full">
      <Card className="bg-opacity-5 bg-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Knowledge Graph Data</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total: {filteredAndSortedData.length} items
            </div>
            <div className="flex items-center space-x-2">
              {selectedRows.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportSelected}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected ({selectedRows.size})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleExportAllHistorical}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="max-w-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button variant={'outline'} onClick={handleSearch}>
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedRows.size === paginatedRows.length && paginatedRows.length > 0}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('keywordId')}>
                      Keyword ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('term')}>
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('createdAt')}>
                      Last Updated
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(row._id)}
                        onCheckedChange={(checked) => handleSelectRow(row._id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{row.keywordId}</TableCell>
                    <TableCell>{row.term}</TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString('en-US')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
          {showModal && (
            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              customContainerClassName="bg-white rounded-md"
            >
              <div className="grid grid-cols-2">
                {selectedRowsData.map((row) => {
                  const displayData = {
                    _id: row._id,
                    keywordId: row.keywordId,
                    term: row.term,
                    historicalData: historicalData[row._id]?.reduce((acc, item) => {
                      acc[new Date(item.createdAt).toLocaleDateString()] = item.data;
                      return acc;
                    }, {}),
                    createdAt: new Date(row.createdAt).toLocaleString()
                  };

                  return (
                    <div key={row._id} className="col-span-1 overflow-auto bg-white rounded-lg shadow">
                      <h3 className="p-4 text-xl font-semibold">
                        {row.term || 'Keyword term'}
                      </h3>

                      <div className="p-4">
                        <JsonViewer data={displayData} isExpanded={true} />
                      </div>

                      {row.createdAt ? (
                        <div className="p-4 bg-gray-50 text-xs text-gray-500">
                          Last updated: {new Date(row.createdAt).toLocaleString()}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Modal>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleGraphTable;


