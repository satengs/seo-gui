'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
  ArrowLeft,
  Download,
  ExternalLink,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';
import { filterKeywordsByType } from '@/lib/utils';
import { flattenDataForCsv } from '@/utils/flattenDataForCsv';
import { DeviceType } from '@/components/ui/device-type';
import { dataTypes, DataType } from '@/consts/dataTypes';
import Pagination from '../KeywordsTable/Pagination';
import axiosClient from '@/lib/axiosClient/index';
import { useToast } from '@/hooks/use-toast';
import { generateCsvFile } from '@/utils';

interface DataTypeFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: DataType;
  data: any;
}

const columnMap: Record<DataType, React.ReactNode> = {
  ai_overview: (
    <>
      <TableHead>Source</TableHead>
      <TableHead>Snippet</TableHead>
      <TableHead>Reference Title</TableHead>
      <TableHead>Reference Link</TableHead>
    </>
  ),
  related_questions: (
    <>
      <TableHead>Question</TableHead>
      <TableHead>Snippet</TableHead>
      <TableHead>Title</TableHead>
      <TableHead>Link</TableHead>
      <TableHead>List Items</TableHead>
      <TableHead>Displayed Link</TableHead>
    </>
  ),
  reddit: (
    <>
      <TableHead>Title</TableHead>
      <TableHead>Snippet</TableHead>
      <TableHead>Link</TableHead>
      <TableHead>Source</TableHead>
      <TableHead>Site links</TableHead>
    </>
  ),
  inline_videos: (
    <>
      <TableHead>Title</TableHead>
      <TableHead>Thumbnail</TableHead>
      <TableHead>Link</TableHead>
      <TableHead>Duration</TableHead>
      <TableHead>Channel</TableHead>
      <TableHead>Platform</TableHead>
    </>
  ),
  knowledge_graph: (
    <>
      <TableHead>Title</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>KGMID</TableHead>
      <TableHead>Knowledge Graph Link</TableHead>
      <TableHead>Website</TableHead>
      <TableHead>Customer Service</TableHead>
      <TableHead>Date Founded</TableHead>
      <TableHead>President</TableHead>
    </>
  ),
  discussions_and_forums: (
    <>
      <TableHead>Title</TableHead>
      <TableHead>Source</TableHead>
      <TableHead>Link</TableHead>
      <TableHead>Forum date</TableHead>
      <TableHead>Answers</TableHead>
    </>
  ),
};

const renderCellLink = (url?: string, text = 'View') =>
  url ? (
    <Link
      href={url}
      target="_blank"
      className="flex items-center hover:text-primary"
    >
      {text} <ExternalLink className="ml-1 h-3 w-3" />
    </Link>
  ) : (
    '-'
  );

const renderByType: Record<
  DataType,
  (row: any, date: string, index: number) => React.ReactNode[]
> = {
  ai_overview: (row, date, index) => {
    const entry = row.historicalData.find((h: any) => h.date === date);
    //TODO fix this

    const refs =
      entry?.keywordData?.data?.ai_overview?.references ||
      entry?.keywordData?.ai_overview?.references ||
      [];
    if (!refs.length) return [];

    return refs.map((ref: any, i: number) => (
      <TableRow key={`${index}-${date}-ref-${i}`}>
        <TableCell>{row.term}</TableCell>
        <TableCell>
          <DeviceType type={row.device} />
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>
          {row?.tags && row?.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row?.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No tags</span>
          )}
        </TableCell>{' '}
        <TableCell>{entry.date}</TableCell>
        <TableCell>{ref.source}</TableCell>
        <TableCell>{ref.snippet}</TableCell>
        <TableCell>{ref.title}</TableCell>
        <TableCell>{renderCellLink(ref.link)}</TableCell>
      </TableRow>
    ));
  },
  related_questions: (row, date, index) => {
    const entry = row.historicalData.find((h: any) => h.date === date);
    const q =
      entry?.keywordData?.data?.related_questions?.[0] ||
      entry?.keywordData?.related_questions?.[0];
    if (!q) return [];
    return [
      <TableRow key={`${index}-${date}-question`}>
        <TableCell>{row.term}</TableCell>
        <TableCell>
          <DeviceType type={row.device} />
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>
          {row?.tags && row?.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row?.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No tags</span>
          )}
        </TableCell>
        <TableCell>{entry.date}</TableCell>
        <TableCell>{q.question || '-'}</TableCell>
        <TableCell className="max-w-[300px] truncate">
          {q.snippet || '-'}
        </TableCell>
        <TableCell>{q.title || '-'}</TableCell>
        <TableCell>{renderCellLink(q.link)}</TableCell>
        <TableCell>
          <ul className="list-disc list-inside">
            {(q.list || []).map((li: string, i: number) => (
              <li key={i} className="truncate">
                {li}
              </li>
            ))}
          </ul>
        </TableCell>
        <TableCell>{q.displayed_link || '-'}</TableCell>
      </TableRow>,
    ];
  },
  reddit: (row, date, index) => {
    const entry = row.historicalData.find((h: any) => h.date === date);
    const results =
      entry?.keywordData?.data?.organic_results ??
      entry?.keywordData?.organic_results ??
      [];
    return results
      .filter((r: any) => /\breddit\b/i.test(r.source?.toLowerCase()))
      .map((result: any, i: number) => (
        <TableRow key={`${index}-${date}-ref-${i}`}>
          <TableCell>{row.term}</TableCell>
          <TableCell>
            <DeviceType type={row.device} />
          </TableCell>
          <TableCell>{row.location}</TableCell>
          <TableCell>
            {row?.tags && row?.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {row?.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-primary/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">No tags</span>
            )}
          </TableCell>
          <TableCell>{entry.date}</TableCell>
          <TableCell>{result.title || '-'}</TableCell>
          <TableCell>{result.snippet || '-'}</TableCell>
          <TableCell>{renderCellLink(result.link)}</TableCell>
          <TableCell>{result.source || '-'}</TableCell>
          <TableCell>
            {(result?.sitelinks?.list || []).map((li: any, i: number) => (
              <ul className="list-disc list-inside mb-4" key={i}>
                <li className="truncate">Title: {li?.title}</li>
                <li className="truncate">Link: {li?.link}</li>
                <li className="truncate">Answer count: {li?.answer_count}</li>
                <li className="truncate">Date: {li?.date}</li>
              </ul>
            ))}
          </TableCell>
        </TableRow>
      ));
  },
  inline_videos: (row, date, index) => {
    const entry = row.historicalData.find((h: any) => h.date === date);
    const video =
      entry?.keywordData?.data?.inline_videos?.[0] ||
      entry?.keywordData?.inline_videos?.[0];
    if (!video) return [];
    return [
      <TableRow key={`${index}-${date}-video`}>
        <TableCell>{row.term}</TableCell>
        <TableCell>
          <DeviceType type={row.device} />
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>
          {row?.tags && row?.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row?.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No tags</span>
          )}
        </TableCell>
        <TableCell>{entry.date}</TableCell>
        <TableCell>{video.title || '-'}</TableCell>
        <TableCell>{renderCellLink(video.thumbnail)}</TableCell>
        <TableCell>{renderCellLink(video.link)}</TableCell>
        <TableCell>{video.duration || '-'}</TableCell>
        <TableCell>{video.channel || '-'}</TableCell>
        <TableCell>{video.platform || '-'}</TableCell>
      </TableRow>,
    ];
  },
  knowledge_graph: (row, date, index) => {
    const entry = row.historicalData.find((h: any) => h.date === date);
    const g =
      entry?.keywordData?.data?.knowledge_graph ||
      entry?.keywordData?.knowledge_graph;
    if (!g) return [];
    return [
      <TableRow key={`${index}-${date}-graph`}>
        <TableCell>{row.term}</TableCell>
        <TableCell>
          <DeviceType type={row.device} />
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>
          {row?.tags && row?.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row?.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No tags</span>
          )}
        </TableCell>
        <TableCell>{entry.date}</TableCell>
        <TableCell>{g.title || '-'}</TableCell>
        <TableCell>{g.entity_type || '-'}</TableCell>
        <TableCell>{g.kgmid || '-'}</TableCell>
        <TableCell>{renderCellLink(g.knowledge_graph_search_link)}</TableCell>
        <TableCell>{g.website || '-'}</TableCell>
        <TableCell>{g.customer_service || '-'}</TableCell>
        <TableCell>{g.date_founded || '-'}</TableCell>
        <TableCell>{g.president || '-'}</TableCell>
      </TableRow>,
    ];
  },
  discussions_and_forums: (row, date, index) => {
    const entry = row.historicalData.find((h: any) => h.date === date);
    const forum =
      entry?.keywordData?.data?.discussions_and_forums?.[0] ||
      entry?.keywordData?.discussions_and_forums?.[0];
    if (!forum) return [];
    return [
      <TableRow key={`${index}-${date}-forums`}>
        <TableCell>{row.term}</TableCell>
        <TableCell>
          <DeviceType type={row.device} />
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>
          {row?.tags && row?.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row?.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No tags</span>
          )}
        </TableCell>
        <TableCell>{entry.date}</TableCell>
        <TableCell>{forum.title || '-'}</TableCell>
        <TableCell>{forum.source}</TableCell>
        <TableCell>{renderCellLink(forum.link)}</TableCell>
        <TableCell>{forum.date || '-'}</TableCell>
        <TableCell>
          {(forum.answers || []).map((li: any, i: number) => (
            <ul className="list-disc list-inside mb-4" key={i}>
              <li className="truncate">Snippet: {li?.snippet}</li>
              <li className="truncate">Link: {li?.link}</li>
              {li?.extensions ? (
                <li className="truncate">Extensions: {li?.extensions}</li>
              ) : (
                ''
              )}
            </ul>
          ))}
        </TableCell>
      </TableRow>,
    ];
  },
};

export default function DataTypeFilterPanel({
  isOpen,
  onClose,
  data,
  type,
}: DataTypeFilterPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(30);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: '', direction: 'asc' });
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const filtered = filterKeywordsByType(data, type);
  const typeInfo = dataTypes.find((dt) => dt.value === type);

  const flatData = useMemo(() => {
    return filtered
      ?.flatMap((row: any, index: number) => {
        const dates = row.historicalData.map((h: any) => h.date);
        return dates.flatMap(
          (date: string) => renderByType[type]?.(row, date, index) ?? []
        );
      })
      .filter(Boolean);
  }, [filtered, type]);

  const getColumnIndex = (key: string): number => {
    switch (key) {
      case 'keyword':
        return 0;
      case 'device':
        return 1;
      case 'location':
        return 2;
      case 'tags':
        return 3;
      case 'date':
        return 4;
      default:
        return 0;
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !flatData) return flatData;

    return [...flatData].sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === 'tags') {
        // Special handling for tags
        const aTagsElement =
          a.props.children[getColumnIndex(sortConfig.key)]?.props?.children;
        const bTagsElement =
          b.props.children[getColumnIndex(sortConfig.key)]?.props?.children;

        // Helper function to extract tag text
        const extractTagText = (element: any): string => {
          if (!element) return '';

          // If it's a div with flex-wrap (tags container)
          if (element.props?.className?.includes('flex-wrap')) {
            const tags = element.props.children;
            if (Array.isArray(tags)) {
              return tags
                .map((tag: any) => tag.props?.children)
                .filter(Boolean)
                .join(', ');
            }
            return element.props.children?.props?.children || '';
          }

          // If it's a single tag
          if (element.props?.children) {
            return element.props.children;
          }

          return '';
        };

        aValue = extractTagText(aTagsElement);
        bValue = extractTagText(bTagsElement);
      } else {
        // Normal handling for other columns
        aValue =
          a.props.children[getColumnIndex(sortConfig.key)]?.props?.children;
        bValue =
          b.props.children[getColumnIndex(sortConfig.key)]?.props?.children;
      }

      if (aValue === bValue) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [flatData, sortConfig]);

  const paginatedRows = sortedData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string | string[]) => {
    setSortConfig((prev) => {
      // If key is an array, use the first key that's different from current
      // or default to the first key in the array
      if (Array.isArray(key)) {
        const newKey = key.find((k) => k !== prev.key) || key[0];
        return {
          key: newKey,
          direction:
            prev.key === newKey && prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      // Handle single key as before
      return {
        key,
        direction:
          prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
      };
    });
  };

  const handlePageChange = ({ page }: { page?: number }) => {
    if (page) {
      setCurrentPage(page);
    }
  };

  const onItemPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  const downloadAsCSV = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await axiosClient.get(`/api/keywords?showCount=true`);
      const totalCount = resp?.data?.totalCount;
      for (let i = 0; i < totalCount; i += 100) {
        const keywordsResp = await axiosClient.get(
          `/api/keywords?fullList=true&page=${i + 1}&size=100`
        );
        console.log('kkk: ', keywordsResp.data);
        if (!keywordsResp?.data?.length) {
          toast({
            title: 'No data to export',
            description: 'There is no data available',
          });
          continue;
        }

        // Filter the data by type
        //TODO change keywordData?.{type}=>keywordData?.data?.{type}
        const filteredData = filterKeywordsByType(keywordsResp.data, type);
        if (!filteredData?.length) {
          toast({
            title: 'No data to export',
            description: `There is no data available for type: ${type}`,
          });
          continue;
        }

        // Use flattenDataForCsv for proper data formatting
        flattenDataForCsv(filteredData, type);
        toast({
          title: 'Success',
          description: 'CSV file has been downloaded',
        });
      }
    } catch (err) {
      console.error('Export error:', err);
      toast({
        title: 'Failed to export csv',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [type, toast]);
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-screen max-w-none h-screen flex flex-col py-4"
        style={{ zIndex: 50 }}
      >
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <SheetTitle className="capitalize">
                {typeInfo?.label || type}
              </SheetTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAsCSV}
              className="flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export CSV
                </>
              )}
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-24 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('keyword')}>
                    Keyword
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('device')}>
                    Device
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
                  <Button variant="ghost" onClick={() => handleSort('tags')}>
                    Tags
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('date')}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                {columnMap[type]}
              </TableRow>
            </TableHeader>
            <TableBody>{paginatedRows}</TableBody>
          </Table>
        </div>

        <div className="border-t px-4 py-2 sticky bottom-0 bg-white z-10">
          <Pagination
            totalCount={flatData?.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onItemPerPageChange={onItemPerPageChange}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
