'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
import { ArrowLeft, Download, ExternalLink, ArrowUpDown } from 'lucide-react';
import { filterKeywordsByType } from '@/lib/utils';
import { flattenDataForCsv } from '@/utils/flattenDataForCsv';
import { DeviceType } from '@/components/ui/device-type';
import { dataTypes, DataType } from '@/consts/dataTypes';
import Pagination from '../KeywordsTable/Pagination';
import axiosClient from '@/lib/axiosClient';
import { useToast } from '@/hooks/use-toast';

interface DataTypeFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: DataType;
  data: any;
}

const columnsMap: Record<DataType, { key: string; label: string }[]> = {
  ai_overview: [
    { key: 'term', label: 'Keyword' },
    { key: 'device', label: 'Device' },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date' },
    { key: 'source', label: 'Source' },
    { key: 'snippet', label: 'Snippet' },
    { key: 'referenceTitle', label: 'Reference Title' },
    { key: 'referenceLink', label: 'Reference Link' },
  ],
  related_questions: [
    { key: 'term', label: 'Keyword' },
    { key: 'device', label: 'Device' },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date' },
    { key: 'question', label: 'Question' },
    { key: 'snippet', label: 'Snippet' },
    { key: 'title', label: 'Title' },
    { key: 'link', label: 'Link' },
    { key: 'listItems', label: 'List Items' },
    { key: 'displayedLink', label: 'Displayed Link' },
  ],
  reddit: [
    { key: 'term', label: 'Keyword' },
    { key: 'device', label: 'Device' },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date' },
    { key: 'title', label: 'Title' },
    { key: 'snippet', label: 'Snippet' },
    { key: 'link', label: 'Link' },
    { key: 'source', label: 'Source' },
    { key: 'siteLinks', label: 'Site links' },
  ],
  inline_videos: [
    { key: 'term', label: 'Keyword' },
    { key: 'device', label: 'Device' },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date' },
    { key: 'title', label: 'Title' },
    { key: 'thumbnail', label: 'Thumbnail' },
    { key: 'link', label: 'Link' },
    { key: 'duration', label: 'Duration' },
  ],
  knowledge_graph: [
    { key: 'term', label: 'Keyword' },
    { key: 'device', label: 'Device' },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date' },
    { key: 'title', label: 'Title' },
    { key: 'entity_type', label: 'Type' },
    { key: 'kgmid', label: 'KGMID' },
    { key: 'knowledge_graph_search_link', label: 'Knowledge Graph Link' },
    { key: 'website', label: 'Website' },
    { key: 'customer_service', label: 'Customer Service' },
    { key: 'date_founded', label: 'Date Founded' },
    { key: 'president', label: 'President' },
  ],
  discussions_and_forums: [
    { key: 'term', label: 'Keyword' },
    { key: 'device', label: 'Device' },
    { key: 'location', label: 'Location' },
    { key: 'date', label: 'Date' },
    { key: 'source', label: 'Source' },
    { key: 'title', label: 'Title' },
    { key: 'link', label: 'Link' },
    { key: 'forum_date', label: 'Forum date' },
    { key: 'forum_answers', label: 'Forum Answers' },
    ]
};


// Flatten data for each data type
function flattenRows(data: any[], type: DataType) {
  if (!data) return [];
  switch (type) {
    case 'ai_overview':
      return data.flatMap((row: any) => {
        const dates = Object.keys(row.historicalData || {});
        return dates.flatMap(date => {
          const entry = row.historicalData[date];
          const ref = entry?.keywordData?.ai_overview?.references?.[0];
          if (!ref) return [];
          return [{
            term: row.term,
            device: row.device,
            location: row.location,
            date,
            source: ref.source
              ? ref.source.replace(/(https?:\/\/[^\s]+)/, ' $1')
              : '-',
            snippet: ref.snippet,
            referenceTitle: ref.title,
            referenceLink: ref.link,
          }];
        });
      });
    case 'related_questions':
      return data.flatMap((row: any) => {
        const dates = Object.keys(row.historicalData || {});
        return dates.flatMap(date => {
          const entry = row.historicalData[date];
          const q = entry?.keywordData?.related_questions?.[0];
          if (!q) return [];
          return [{
            term: row.term,
            device: row.device,
            location: row.location,
            date,
            question: q.question || '-',
            snippet: q.snippet || '-',
            title: q.title || '-',
            link: q.link || '-',
            listItems: (q.list || []).join(', '),
            displayedLink: q.displayed_link || '-',
          }];
        });
      });
    case 'reddit':
      return data.flatMap((row: any) => {
        const dates = Object.keys(row.historicalData || {});
        return dates.flatMap(date => {
          const entry = row.historicalData[date];
          const results = entry?.keywordData?.organic_results ?? [];
          return results
            .filter((r: any) => /\breddit\b/i.test(r.source?.toLowerCase()))
            .map((result: any) => ({
              term: row.term,
              device: row.device,
              location: row.location,
              date,
              title: result.title || '-',
              snippet: result.snippet || '-',
              link: result.link || '-',
              source: result.source || '-',
              siteLinks: (result?.sitelinks?.list || []).map((li: any) => `${li.title || ''} (${li.link || ''})`).join('; '),
            }));
        });
      });
    case 'inline_videos':
      return data.flatMap((row: any) => {
        const dates = Object.keys(row.historicalData || {});
        return dates.flatMap(date => {
          const entry = row.historicalData[date];
          const video = entry?.keywordData?.inline_videos?.[0];
          if (!video) return [];
          return [{
            term: row.term,
            device: row.device,
            location: row.location,
            date,
            title: video.title || '-',
            thumbnail: video.thumbnail || '-',
            link: video.link || '-',
            duration: video.duration || '-',
          }];
        });
      });
    case 'knowledge_graph':
      return data.flatMap((row: any) => {
        const dates = Object.keys(row.historicalData || {});
        return dates.flatMap(date => {
          const entry = row.historicalData[date];
          const g = entry?.keywordData?.knowledge_graph;
          if (!g) return [];
          return [{
            term: row.term,
            device: row.device,
            location: row.location,
            date,
            title: g.title || '-',
            entity_type: g.entity_type || '-',
            kgmid: g.kgmid || '-',
            knowledge_graph_search_link: g.knowledge_graph_search_link || '-',
            website: g.website || '-',
            customer_service: g.customer_service || '-',
            date_founded: g.date_founded || '-',
            president: g.president || '-',
          }];
        });
      });
    case 'discussions_and_forums':
      return data.flatMap((row: any) => {
        if (!row || !row.historicalData) return [];

        const dates = Object.keys(row.historicalData);
        return dates.flatMap(date => {
          const entry = row.historicalData[date];
          const g = entry?.keywordData?.discussions_and_forums;

          if (!g) return [];

          return g.map((ans, i) => {
            const snippet = ans.snippet?.trim().replace(/\s+/g, " ") || "";
            const answerLink = ans.link || "";
            const extensions = (ans.extensions || []).join(", ");

            return {
              term: row.term || "-",
              device: row.device || "-",
              location: row.location || "-",
              date,
              source: ans.source || '-',
              title: ans.title || '-',
              link: answerLink || '-',
              forum_date: ans.date || '-',
              forum_answers: `snippet: ${snippet} \n 
link: ${answerLink} \n extensions: ${extensions} \n`
            };
          });
        });
      });


    default:
      return [];
  }
}

export default function DataTypeFilterPanel({
  isOpen,
  onClose,
  data,
  type,
}: DataTypeFilterPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(30);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: '', direction: 'asc' });
  const { toast } = useToast();

  const filtered = filterKeywordsByType(data, type);
  const columns = columnsMap[type];
  const flatData = useMemo(() => flattenRows(filtered, type), [filtered, type]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return flatData;
    return [...flatData].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [flatData, sortConfig]);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => {
      const direction = prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  }, []);

  const paginatedRows = sortedData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = ({ page }: { page?: number }) => {
    if (page) {
      setCurrentPage(page);
    }
  };

  const onItemPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset page to 1 when per page changes
  }, []);

  const downloadAsCSV = useCallback(async () => {
    try {
      const resp = await axiosClient.get(`/api/keywords?fullList=${true}`);
      flattenDataForCsv(resp?.data || [], type);
    } catch (err) {
      toast({
        title: 'Failed to export csv',
        description: 'Something went wrong',
      });
    }
  }, [toast]);

  const typeInfo = dataTypes.find((dt) => dt.value === type);

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
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-24 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(col => (
                  <TableHead
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown className="h-4 w-4" />
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows && paginatedRows.length > 0 ? (
                paginatedRows.map((row, idx) => (
                  <TableRow key={idx}>
                    {columns.map(col => (
                      <TableCell key={col.key}>{String(row[col.key] ?? '')}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>No data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t px-4 py-2 sticky bottom-0 bg-white z-10">
          <Pagination
            totalCount={sortedData?.length}
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
