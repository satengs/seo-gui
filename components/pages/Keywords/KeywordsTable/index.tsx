'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  ChangeEvent,
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
  Tag,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Modal from '@/components/shared/Modal';
import DifferenceModal from '@/components/pages/Keywords/DifferenceModal';
import KeywordDialog from '@/components/pages/Keywords/KeywordDialog';
import ActionsComponent from './ActionsComponent';
import { shortenLocation } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateCsvFile } from '@/utils';
import axiosClient from '@/lib/axiosClient';
import featureIcons from '@/components/pages/Keywords/KeywordsTable/feature-icons';
import { IKeyword, IKeywordPaginateParams } from '@/types';
import RemoveAlerting from '@/components/pages/Keywords/KeywordsTable/ActionsComponent/RemoveAlerting';
import { DeviceType } from '@/components/ui/device-type';
import { DateRange } from 'react-day-picker';

interface KeywordsTableProps {
  keywords: IKeyword[] | null;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  fetchLoading: boolean;
  dateRange: DateRange | undefined;
  onActionKeywordsChange: (data: any, obj?: any) => void;
  onSingleKeywordChange: (data: any) => void;
  onItemsSelect: (data: string[]) => void;
  onKeywordFilterChange: (data: any) => void;
  onKeywordsPaginate: (data: IKeywordPaginateParams) => void;
}

export default function KeywordsTable({
  keywords = [],
  currentPage,
  totalCount,
  fetchLoading,
  dateRange,
  onItemsSelect,
  onKeywordFilterChange,
  onSingleKeywordChange,
  onActionKeywordsChange,
}: KeywordsTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [downloadAllCsv, setDownloadAllCsv] = useState<boolean>(false);
  const [downloadSelectedCsv, setDownloadSelectedCsv] =
    useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: 'asc',
  });
  const [selectedKeyword, setSelectedKeyword] = useState<IKeyword | null>(null);
  const [showTagsDialog, setShowTagsDialog] = useState<boolean>(false);
  const { toast } = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

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
      historicalData: Array.isArray(keyword.historicalData)
        ? keyword.historicalData
        : Object.entries(keyword.historicalData || {}).map(([key, value]) => ({
            key,
            value,
          })),
    }));
  }, [keywords]);

  const getHistoricalDates = useCallback((keyword: IKeyword) => {
    const data = [];
    for (const value of keyword.historicalData) {
      data.push({
        date: value.date,
        kgmid: value.kgmid,
        kgmTitle: value.kgmTitle,
        kgmWebsite: value.kgmWebsite,
        organicResultsCount: value.organicResultsCount,
        timestamp: value.timestamp,
        kgmData: value.keywordData,
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

  const handleTermChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

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

  useEffect(() => {
    const items = Array.from(selectedRows);
    onItemsSelect(items);
  }, [selectedRows, onItemsSelect]);

  const selectedKeywords = useMemo(() => {
    return filteredAndSortedData.filter((keyword) =>
      selectedRows.has(keyword._id)
    );
  }, [selectedRows, filteredAndSortedData]);

  const downloadAsCSV = useCallback(
    async (data: IKeyword[]) => {
      try {
        setDownloadSelectedCsv(true);
        generateCsvFile(data);
      } catch (err) {
        toast({
          title: 'Failed to export selected csv',
          description: 'Something went wrong',
        });
      } finally {
        setDownloadSelectedCsv(false);
      }
    },
    [toast]
  );

  const downloadAsCSVAll = useCallback(async () => {
    try {
      setDownloadAllCsv(true);
      let queryString = `/api/keywords?fullList=true`;

      if (searchTerm) {
        queryString += `&searchTerm=${searchTerm}`;
      }
      if (sortConfig?.key?.length) {
        queryString += `&sortKey=${sortConfig.key}&sortDirection=${sortConfig.key}`;
      }
      if (dateRange?.from && dateRange?.to) {
        queryString += `&dateFrom=${dateRange.from}&dateTo=${dateRange.to}`;
      }
      const resp = await axiosClient.get(queryString);
      generateCsvFile(resp?.data || []);
    } catch (err) {
      toast({
        title: 'Failed to export csv',
        description: 'Something went wrong',
      });
    } finally {
      setDownloadAllCsv(false);
    }
  }, [toast, searchTerm, sortConfig, dateRange]);

  const handleKeywordsDelete = async () => {
    try {
      const keywordIds = Array.from(selectedRows);

      await Promise.all(
        keywordIds.map((id) =>
          axiosClient.delete(`/api/keywords?keyword=${id}&page=${currentPage}`)
        )
      );
      let pageToFetch = currentPage;
      if (keywords && keywordIds.length >= keywords.length && currentPage > 1) {
        pageToFetch = currentPage - 1;
      }

      const response = await axiosClient.get(
        `/api/keywords?page=${pageToFetch}`
      );

      onActionKeywordsChange(response?.data || []);
      toast({
        title: 'Success',
        description: `Successfully deleted ${keywordIds.length} keywords`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete keywords',
        variant: 'destructive',
      });
    } finally {
      setIsOpen(false);
    }
  };

  const onFilterByKeyword = useCallback(() => {
    onKeywordFilterChange({ searchTerm });
  }, [searchTerm, onKeywordFilterChange]);

  const onModalOpen = useCallback(() => setShowModal(true), []);
  const onModalClose = useCallback(() => setShowModal(false), []);
  const fieldsArr = [
    'search_metadata',
    'search_parameters',
    'organic_results',
    'pagination',
    'serpapi_pagination',
  ];

  const renderDataFeatures = useCallback(
    (keyword:any) => {
      //TODO fix this and remove the any type
      const data = keyword.kgmData?.data && Object.keys(keyword.kgmData?.data).length ?  keyword.kgmData.data :  keyword.kgmData || {};

      const features = Object.keys(data).filter(
        (field) => !fieldsArr.includes(field)
      );
      return features.map((field) => {
        const feature = featureIcons[field];
        if (!feature) return null;

        const IconComponent = feature.icon;
        return (
          <div
            key={field}
            className={`p-1 rounded-full ${feature.bgClass} ${feature.textClass}`}
            title={feature.label}
          >
            <IconComponent className="h-3.5 w-3.5" />
          </div>
        );
      });
    },
    [fieldsArr]
  );

  return (
    <div className="mx-1 py-3 md:w-[820px] xl:w-[1400px] 3xl:w-full">
      <Card className="bg-opacity-5 bg-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Keywords</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total: {totalCount} keywords
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={downloadAsCSVAll}>
                {downloadAllCsv ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <>
                    {' '}
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </>
                )}
              </Button>
              {selectedRows.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadAsCSV(selectedKeywords)}
                >
                  {downloadSelectedCsv ? (
                    // <div className="flex items-center min-w-30 w-full">
                    <Loader2 className=" h-4 w-4 animate-spin" />
                  ) : (
                    // </div>
                    <>
                      {' '}
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected ({selectedRows.size})
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search keywords..."
                value={searchTerm}
                onChange={handleTermChange}
                className="max-w-sm"
              />
              <Button variant={'outline'} onClick={onFilterByKeyword}>
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
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
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('kgmWebsite')}
                    >
                      KGM Website
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('organicResultsCount')}
                    >
                      Organic Results
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('updatedAt')}
                    >
                      Last Updated
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Data Features</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-md">
                {!fetchLoading ? (
                  filteredAndSortedData?.length ? (
                    filteredAndSortedData.map((keyword) => {
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
                                  keyword.isDefaultKeywords
                                    ? 'Default keyword'
                                    : ''
                                }
                              >
                                {keyword.term}
                              </div>
                            </TableCell>
                            <TableCell className="justify-items-center text-xs">
                              <span title={keyword.location}>
                                {shortenLocation(keyword.location)}
                              </span>
                            </TableCell>
                            <TableCell className="justify-items-center">
                              <DeviceType type={keyword.device} />
                            </TableCell>
                            <TableCell className="justify-items-center text-xs">
                              {keyword.kgmid || '-'}
                            </TableCell>
                            <TableCell className="justify-items-center text-xs">
                              {keyword.kgmTitle || '-'}
                            </TableCell>
                            <TableCell className="justify-items-center ">
                              {keyword.kgmWebsite && (
                                <Link
                                  href={keyword.kgmWebsite}
                                  target="_blank"
                                  className="flex items-center hover:underline"
                                >
                                  <span className="text-xs overflow-hidden text-ellipsis w-20">
                                    {new URL(keyword.kgmWebsite).hostname}
                                  </span>
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {keyword?.tags && keyword?.tags?.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {keyword?.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-0.5 text-xs rounded-full bg-primary/10"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-sm">
                                    No tags
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setSelectedKeyword(keyword);
                                    setShowTagsDialog(true);
                                  }}
                                >
                                  <Tag className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {keyword.organicResultsCount?.toLocaleString() ||
                                '-'}
                            </TableCell>
                            <TableCell>
                              {keyword.updatedAt
                                ? new Date(
                                    keyword.updatedAt
                                  ).toLocaleDateString()
                                : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-0.5">
                                {keyword.keywordData &&
                                  keyword.keywordData.data &&
                                  Object.keys(keyword.keywordData.data).map(
                                    (field) => {
                                      if (fieldsArr.includes(field))
                                        return null;

                                      const feature = featureIcons[field];
                                      if (!feature) return field;

                                      const IconComponent = feature.icon;

                                      return (
                                        <div
                                          key={field}
                                          className={`p-1 rounded-full ${feature.bgClass} ${feature.textClass}`}
                                          title={feature.label}
                                        >
                                          <IconComponent className="h-3.5 w-3.5" />
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <ActionsComponent
                                  keyword={keyword}
                                  onActionKeywordsChange={
                                    onActionKeywordsChange
                                  }
                                  currentPage={currentPage}
                                />
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
                                          <TableHead>Data Features</TableHead>
                                          <TableHead className="text-right">
                                            Total Results
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody className="text-xs">
                                        {dates.map((entry, i) => {
                                          return (
                                            <TableRow
                                              key={entry.date + i}
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
                                              <TableCell>
                                                <div className="flex items-center gap-0.5">
                                                {renderDataFeatures(entry)}
                                                </div>
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
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11}>
                        <p className={'py-3 font-medium'}>No keywords</p>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={11}>
                      <p className={'py-3 font-medium'}>
                        Loading keywords . . .
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {selectedRows.size >= 1 && (
            <div className="fixed right-0 top-1/2 flex flex-col gap-2 transform -translate-y-1/2">
              <Button
                variant="secondary"
                className="text-white bg-sky-400 border-[1px] rounded-l-3xl rounded-r-none hover:bg-gray-500 border-red-800 h-auto py-3 px-4"
                onClick={onModalOpen}
              >
                View Data
              </Button>
              <Button
                variant="secondary"
                className="text-white bg-red-500 border-[1px] rounded-l-3xl rounded-r-none hover:bg-red-600 border-red-600 h-auto py-3 px-4"
                onClick={() => setIsOpen(true)}
              >
                Delete Keywords
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
          {showTagsDialog && selectedKeyword && (
            <KeywordDialog
              isOpen={showTagsDialog}
              onCloseAction={() => setShowTagsDialog(false)} // Renamed from onClose
              keyword={selectedKeyword}
              onSaveAction={onSingleKeywordChange} // Renamed from onSave
            />
          )}
          <RemoveAlerting
            selectedRows={selectedRows}
            onConfirm={handleKeywordsDelete}
            setIsOpen={setIsOpen}
            isDefaultKeywords={false}
            multipleKeyword
            isOpen={isOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
}
