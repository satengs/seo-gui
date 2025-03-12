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
  Bot,
  Info,
  Image,
  HelpCircle,
  Newspaper,
  Link as Link1,
  Search as ListSearch,
  Sparkles, Phone, Tablet, Computer,
  Link2, FilterIcon, Star, Menu, Map as MapIcon, PlayCircle, MessageSquare, Video, MessagesSquare, MapPinned, Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Modal from '@/components/shared/Modal';
import DifferenceModal from '@/components/pages/Keywords/DifferenceModal';
import ActionsComponent from './ActionsComponent';
import debounce from 'lodash.debounce';
import {generateMultiCSV, shortenLocation} from '@/lib/utils';
import { IKeyword, IKeywordPaginateParams } from '@/types';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

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
  const fieldsArr = ['search_metadata', 'search_parameters', 'organic_results', 'pagination', 'serpapi_pagination'];

  const featureIcons = {
    search_information: {
      icon: Info,
      label: 'Search Information',
      bgClass: 'bg-blue-100 dark:bg-blue-900',
      textClass: 'text-blue-800 dark:text-blue-200',
      borderClass: 'border-blue-200 dark:border-blue-800'
    },
    knowledge_graph: {
      icon: ListSearch,
      label: 'Knowledge Graph',
      bgClass: 'bg-purple-100 dark:bg-purple-900',
      textClass: 'text-purple-800 dark:text-purple-200',
      borderClass: 'border-purple-200 dark:border-purple-800'
    },
    inline_images: {
      icon: Image,
      label: 'Inline Images',
      bgClass: 'bg-green-100 dark:bg-green-900',
      textClass: 'text-green-800 dark:text-green-200',
      borderClass: 'border-green-200 dark:border-green-800'
    },
    related_questions: {
      icon: HelpCircle,
      label: 'Related Questions',
      bgClass: 'bg-orange-100 dark:bg-orange-900',
      textClass: 'text-orange-800 dark:text-orange-200',
      borderClass: 'border-orange-200 dark:border-orange-800'
    },
    ai_overview: {
      icon: Bot,
      label: 'AI Overview',
      bgClass: 'bg-emerald-100 dark:bg-emerald-900',
      textClass: 'text-emerald-800 dark:text-emerald-200',
      borderClass: 'border-emerald-200 dark:border-emerald-800'
    },
    top_stories: {
      icon: Newspaper,
      label: 'Top Stories',
      bgClass: 'bg-red-100 dark:bg-red-900',
      textClass: 'text-red-800 dark:text-red-200',
      borderClass: 'border-red-200 dark:border-red-800'
    },
    top_stories_link: {
      icon: Link2,
      label: 'Top Stories Link',
      bgClass: 'bg-indigo-100 dark:bg-indigo-900',
      textClass: 'text-indigo-800 dark:text-indigo-200',
      borderClass: 'border-indigo-200 dark:border-indigo-800'
    },
    top_stories_serpapi_link: {
      icon: Link1,
      label: 'Top Stories SERP Link',
      bgClass: 'bg-pink-100 dark:bg-pink-900',
      textClass: 'text-pink-800 dark:text-pink-200',
      borderClass: 'border-pink-200 dark:border-pink-800'
    },
    related_searches: {
      icon: Sparkles,
      label: 'Related Searches',
      bgClass: 'bg-cyan-100 dark:bg-cyan-900',
      textClass: 'text-cyan-800 dark:text-cyan-200',
      borderClass: 'border-cyan-200 dark:border-cyan-800'
    },
    filters: {
      icon: FilterIcon,
      label: 'Filters',
      bgClass: 'bg-cyan-100 dark:bg-yellow-900',
      textClass: 'text-cyan-800 dark:text-cyan-200',
      borderClass: 'border-cyan-200 dark:border-cyan-800'
    },
    inline_videos: {
      icon: Video,
      label: 'Inline Videos',
      bgClass: 'bg-yellow-100 dark:bg-yellow-900',
      textClass: 'text-yellow-800 dark:text-yellow-200',
      borderClass: 'border-yellow-200 dark:border-yellow-800'
    },
    perspectives: {
      icon: MessageSquare,
      label: 'Perspectives',
      bgClass: 'bg-violet-100 dark:bg-violet-900',
      textClass: 'text-violet-800 dark:text-violet-200',
      borderClass: 'border-violet-200 dark:border-violet-800'
    },
    discussions_and_forums: {
      icon: MessagesSquare,
      label: 'Discussions & Forums',
      bgClass: 'bg-fuchsia-100 dark:bg-fuchsia-900',
      textClass: 'text-fuchsia-800 dark:text-fuchsia-200',
      borderClass: 'border-fuchsia-200 dark:border-fuchsia-800'
    },
    short_videos: {
      icon: PlayCircle,
      label: 'Short Videos',
      bgClass: 'bg-rose-100 dark:bg-rose-900',
      textClass: 'text-rose-800 dark:text-rose-200',
      borderClass: 'border-rose-200 dark:border-rose-800'
    },
    ads: {
      icon: Target,
      label: 'Ads',
      bgClass: 'bg-lime-100 dark:bg-lime-900',
      textClass: 'text-lime-800 dark:text-lime-200',
      borderClass: 'border-lime-200 dark:border-lime-800'
    },
    local_map: {
      icon: MapPinned,
      label: 'Local Map',
      bgClass: 'bg-gray-100 dark:bg-gray-900',
      textClass: 'text-teal-800 dark:text-teal-200',
      borderClass: 'border-teal-200 dark:border-teal-800'
    },
    local_results: {
      icon: MapIcon,
      label: 'Local Results',
      bgClass: 'bg-emerald-100 dark:bg-emerald-900',
      textClass: 'text-emerald-800 dark:text-emerald-200',
      borderClass: 'border-emerald-200 dark:border-emerald-800'
    },
    menu_highlights: {
      icon: Menu,
      label: 'Menu Highlights',
      bgClass: 'bg-amber-100 dark:bg-amber-900',
      textClass: 'text-amber-800 dark:text-amber-200',
      borderClass: 'border-amber-200 dark:border-amber-800'
    },
    reviews: {
      icon: Star,
      label: 'Reviews',
      bgClass: 'bg-orange,100 dark:bg-orange-900',
      textClass: 'text-orange-800 dark:text-orange-200',
      borderClass: 'border-orange-200 dark:border-orange-800',
    },
  };

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
                    <TableHead className="w-[350px]">
                      <Button variant="ghost" onClick={() => handleSort('term')}>
                        Keyword
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <Button
                          variant="ghost"
                          onClick={() => handleSort('location')}
                      >
                        Location
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <Button
                          variant="ghost"
                          onClick={() => handleSort('device')}
                      >
                        Device
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <Button variant="ghost" onClick={() => handleSort('kgmid')}>
                        KGM ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <Button
                          variant="ghost"
                          onClick={() => handleSort('kgmTitle')}
                      >
                        KGM Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[50px]">KGM Website</TableHead>
                    <TableHead>
                      <Button
                          variant="ghost"
                          onClick={() => handleSort('organicResultsCount')}
                      >
                        Org. Results
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Data Features</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-md">
                  {filteredAndSortedData.map((keyword) => {
                    const dates = getHistoricalDates(keyword);
                    return (
                        <React.Fragment key={keyword._id}>
                          <TableRow className="hover:bg-muted/50 cursor-pointer">
                            <TableCell className="justify-items-center">
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
                            <TableCell className="justify-items-center text-xs"><span title={keyword.location}>{shortenLocation(keyword.location)}</span></TableCell>
                            <TableCell className="justify-items-center">
                              {keyword.device === 'desktop' ? <Computer className="h-4 w-4"/> : <Phone className="h-4 w-4"/>}
                            </TableCell>
                            <TableCell  className="justify-items-center text-xs">{keyword.kgmid || '-'}</TableCell>
                            <TableCell  className="justify-items-center text-xs">{keyword.kgmTitle || '-'}</TableCell>
                            <TableCell  className="justify-items-center ">
                              {keyword.kgmWebsite && (
                                  <Link
                                      href={keyword.kgmWebsite}
                                      target="_blank"
                                      className="flex items-center hover:underline "
                                  >
                                    <span className="text-xs overflow-hidden text-ellipsis w-20">{new URL(keyword.kgmWebsite).hostname}</span>
                                    <ExternalLink className="ml-1 h-3 w-3"/>
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
                              <div className="flex items-center gap-0.5">
                                {keyword.keywordData && keyword.keywordData.data && Object.keys(keyword.keywordData.data).map((item) => {
                                  // Skip metadata and parameter fields
                                  if (fieldsArr.includes(item)) return null;

                                  const feature = featureIcons[item];
                                  if (!feature) return item;

                                  const IconComponent = feature.icon;

                                  return (
                                        <div key={item} className={`p-1 rounded-full ${feature.bgClass} ${feature.textClass}`} title={feature.label}>
                                          <IconComponent className="h-3.5 w-3.5"/>
                                        </div>
                                  );
                                })}
                              </div>
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