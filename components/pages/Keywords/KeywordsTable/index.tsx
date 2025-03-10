'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  ChangeEvent,
  useRef,
  useEffect,
} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Download,
  Search,
  ArrowUpDown,
  ChevronRight,
  ChevronDown,
  History,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Modal from '@/components/shared/Modal';
import DifferenceModal from '@/components/pages/Keywords/DifferenceModal';
import ActionsComponent from './ActionsComponent';
import debounce from 'lodash.debounce';
import { generateMultiCSV } from '@/lib/utils';
import { IKeyword, IKeywordPaginateParams } from '@/types';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';

interface KeywordsTableProps {
  keywords: IKeyword[];
  currentPage: number;
  totalCount: number;
  totalPages: number;
  onActionKeywordsChange: (data: any, obj?: any) => void;
  onKeywordFilterChange: (data: any) => void;
  onKeywordsPaginate: (data: IKeywordPaginateParams) => void;
}

export default function KeywordsTable({
  keywords = [],
  currentPage,
  totalCount,
  onKeywordFilterChange,
  onActionKeywordsChange,
}: KeywordsTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'asc',
  });
  const { toast } = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleRowExpansion = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const filteredAndSortedData = useMemo(() => {
    if (!keywords?.length) return [];

    return keywords.map((keyword) => ({
      ...keyword,
      historicalData:
        keyword.historicalData instanceof Map
          ? keyword.historicalData
          : new Map(Object.entries(keyword.historicalData || {})),
    }));
  }, [keywords]);

  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      onKeywordFilterChange({ searchTerm: value });
    }, 800)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const getHistoricalDates = useCallback((keyword: IKeyword) => {
    const data = [];
    for (const [key, value] of keyword.historicalData) {
      data.push({
        date: key,
        kgmid: value.kgmid,
        kgmTitle: value.kgmTitle,
        kgmWebsite: value.kgmWebsite,
        organicResultsCount: value.organicResultsCount,
        timestamp: value.timestamp,
      });
    }
    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

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
      onKeywordFilterChange({
        sortBy: { key, direction },
      });
    },
    [onKeywordFilterChange]
  );

  const handleTermChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      await debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const toggleAllRows = useCallback(() => {
    setSelectedRows((prev) =>
      prev.size === filteredAndSortedData.length
        ? new Set()
        : new Set(filteredAndSortedData.map((k) => k._id))
    );
  }, [filteredAndSortedData]);

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectedKeywords = useMemo(() => {
    return filteredAndSortedData.filter((keyword) =>
      selectedRows.has(keyword._id)
    );
  }, [selectedRows, filteredAndSortedData]);

  const downloadAsCSV = useCallback((data: IKeyword[]) => {
    const csvContent = generateMultiCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  const downloadAsCSVAll = useCallback(async () => {
    try {
      const resp = await axiosClient.get(`/api/keywords?fullList=${true}`);
      const csvContent = generateMultiCSV(resp?.data);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'keyword-data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        title: 'Failed to export csv',
        description: 'Something went wrong',
      });
    }
  }, []);

  const onModalOpen = useCallback(() => setShowModal(true), []);
  const onModalClose = useCallback(() => setShowModal(false), []);

  return (
    <div className="mx-1 py-3">
      <Card className="bg-opacity-5 bg-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Keywords</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total: {totalCount} keywords
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={downloadAsCSVAll}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              {selectedRows.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadAsCSV(selectedKeywords)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected ({selectedRows.size})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={handleTermChange}
                className="max-w-sm"
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]">
                    <Checkbox
                      checked={
                        selectedRows.size === filteredAndSortedData.length
                      }
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead className="w-[300px]">
                    <Button variant="ghost" onClick={() => handleSort('term')}>
                      Keyword
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('location')}
                    >
                      Location
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('device')}
                    >
                      Device Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('kgmid')}>
                      KGM ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('kgmTitle')}
                    >
                      KGM Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>KGM Website</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('organicResultsCount')}
                    >
                      Organic Results
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-md">
                {filteredAndSortedData.map((keyword) => {
                  const dates = getHistoricalDates(keyword);
                  return (
                    <React.Fragment key={keyword._id}>
                      <TableRow className="hover:bg-muted/50 cursor-pointer">
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.has(keyword._id)}
                            onCheckedChange={() =>
                              toggleRowSelection(keyword._id)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleRowExpansion(keyword._id)}
                          >
                            {expandedRows.has(keyword._id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div
                            className={`${keyword.isDefaultKeywords ? 'bg-blue-100 dark:bg-blue-950' : ''} px-2 py-1 rounded-md`}
                            title={
                              keyword.isDefaultKeywords ? 'Default keyword' : ''
                            }
                          >
                            {keyword.term}
                          </div>
                        </TableCell>
                        <TableCell>{keyword.location}</TableCell>
                        <TableCell className="capitalize">
                          {keyword.device}
                        </TableCell>
                        <TableCell>{keyword.kgmid || '-'}</TableCell>
                        <TableCell>{keyword.kgmTitle || '-'}</TableCell>
                        <TableCell>
                          {keyword.kgmWebsite && (
                            <Link
                              href={keyword.kgmWebsite}
                              target="_blank"
                              className="flex items-center hover:underline"
                            >
                              {new URL(keyword.kgmWebsite).hostname}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {keyword.organicResultsCount?.toLocaleString() || '-'}
                        </TableCell>
                        <TableCell>
                          {keyword.updatedAt
                            ? new Date(keyword.updatedAt).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <ActionsComponent
                              keyword={keyword}
                              onActionKeywordsChange={onActionKeywordsChange}
                              currentPage={currentPage}
                            />
                            {/*<Button*/}
                            {/*    variant="ghost"*/}
                            {/*    size="sm"*/}
                            {/*    onClick={() => downloadAsCSV([keyword])}*/}
                            {/*    className="h-8 w-8 p-0"*/}
                            {/*    title="Export keyword history"*/}
                            {/*>*/}
                            {/*    <Download className="h-4 w-4" />*/}
                            {/*</Button>*/}
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(keyword._id) && dates?.length ? (
                        <TableRow>
                          <TableCell colSpan={13} className="p-0">
                            <div className="bg-muted/50 border-y">
                              <div className="p-2 border-b bg-muted/70">
                                <span className="flex items-center text-sm font-medium text-muted-foreground">
                                  <History className="h-4 w-4 mr-2" />
                                  Historical Data
                                </span>
                              </div>
                              <div className="px-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                      <TableHead className="w-[540px]">
                                        Date
                                      </TableHead>
                                      <TableHead>KGM ID</TableHead>
                                      <TableHead>KGM Title</TableHead>
                                      <TableHead>KGM Website</TableHead>
                                      <TableHead className="text-right">
                                        Total Results
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody className="text-xs">
                                    {dates.map((entry) => {
                                      return (
                                        <TableRow
                                          key={entry.date}
                                          className="hover:bg-muted/30"
                                        >
                                          <TableCell className="py-2 font-medium">
                                            {new Date(
                                              entry.date
                                            ).toLocaleDateString()}{' '}
                                          </TableCell>
                                          <TableCell>
                                            {entry.kgmid || '-'}
                                          </TableCell>
                                          <TableCell>
                                            {entry.kgmTitle || '-'}
                                          </TableCell>
                                          <TableCell>
                                            {entry.kgmWebsite && (
                                              <Link
                                                href={entry.kgmWebsite}
                                                target="_blank"
                                                className="flex items-center hover:underline"
                                              >
                                                {
                                                  new URL(entry.kgmWebsite)
                                                    .hostname
                                                }
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                              </Link>
                                            )}
                                          </TableCell>
                                          <TableCell
                                            className="text-right font-mono"
                                            title={`${entry.organicResultsCount === 0 ? 'No result found' : ''} `}
                                          >
                                            {entry.organicResultsCount?.toLocaleString() ||
                                              '-'}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {selectedRows.size >= 1 && (
            <div className="fixed top-1/2 right-0">
              <Button
                variant="secondary"
                className="text-white bg-sky-400 border-[1px] rounded-l-3xl rounded-r-none hover:bg-gray-500 border-red-800 h-auto py-3 px-4"
                onClick={onModalOpen}
              >
                View Data
              </Button>
            </div>
          )}
          {showModal && (
            <Modal
              isOpen={showModal}
              onClose={onModalClose}
              customContainerClassName="bg-white rounded-md"
            >
              <DifferenceModal keywords={selectedKeywords} />
            </Modal>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
