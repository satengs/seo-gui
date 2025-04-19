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
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { filterKeywordsByType } from '@/lib/utils';
import { flattenDataForCsv } from '@/utils/flattenDataForCsv';
import { DeviceType } from '@/components/ui/device-type';
import { dataTypes, DataType } from '@/consts/dataTypes';
import Pagination from '../KeywordsTable/Pagination';

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
    const ref =
      row.historicalData[date]?.keywordData?.data?.ai_overview?.references?.[0];
    if (!ref) return [];
    return [
      <TableRow key={`${index}-${date}-ref`}>
        <TableCell>{row.term}</TableCell>
        <TableCell>
          <DeviceType type={row.device} />
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{date}</TableCell>
        <TableCell>{ref.source}</TableCell>
        <TableCell>{ref.snippet}</TableCell>
        <TableCell>{ref.title}</TableCell>
        <TableCell>{renderCellLink(ref.link)}</TableCell>
      </TableRow>,
    ];
  },
  related_questions: (row, date, index) => {
    const q =
      row.historicalData[date]?.keywordData?.data?.related_questions?.[0];
    if (!q) return [];
    return [
      <TableRow key={`${index}-${date}-question`}>
        <TableCell>{row.term}</TableCell>
        <TableCell>
          <DeviceType type={row.device} />
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{date}</TableCell>
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
    const results =
      row.historicalData[date]?.keywordData?.data?.organic_results ?? [];
    return results
      .filter((r: any) => /\breddit\b/i.test(r.source?.toLowerCase()))
      .map((result: any, i: number) => (
        <TableRow key={`${index}-${date}-ref-${i}`}>
          <TableCell>{row.term}</TableCell>
          <TableCell>
            <DeviceType type={row.device} />
          </TableCell>
          <TableCell>{row.location}</TableCell>
          <TableCell>{date}</TableCell>
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
    const video =
      row.historicalData[date]?.keywordData?.data?.inline_videos?.[0];
    if (!video) return [];
    return [
      <TableRow key={`${index}-${date}-video`}>
        <TableCell>{row.term}</TableCell>
        <TableCell>
          <DeviceType type={row.device} />
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{date}</TableCell>
        <TableCell>{video.title || '-'}</TableCell>
        <TableCell>{renderCellLink(video.thumbnail)}</TableCell>
        <TableCell>{renderCellLink(video.link)}</TableCell>
        <TableCell>{video.duration || '-'}</TableCell>
      </TableRow>,
    ];
  },
  knowledge_graph: (row, date, index) => {
    const g = row.historicalData[date]?.keywordData?.data?.knowledge_graph;
    if (!g) return [];
    return [
      <TableRow key={`${index}-${date}-graph`}>
        <TableCell>{row.term}</TableCell>
        <TableCell>
          <DeviceType type={row.device} />
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{date}</TableCell>
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
};

export default function DataTypeFilterPanel({
  isOpen,
  onClose,
  data,
  type,
}: DataTypeFilterPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(30);

  const filtered = filterKeywordsByType(data, type);
  const typeInfo = dataTypes.find((dt) => dt.value === type);

  const flatData = useMemo(() => {
    return filtered
      ?.flatMap((row: any, index: number) => {
        const dates = Object.keys(row.historicalData || {});
        return dates.flatMap(
          (date) => renderByType[type]?.(row, date, index) ?? []
        );
      })
      .filter(Boolean);
  }, [filtered, type]);

  const paginatedRows = flatData?.slice(
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

  const downloadAsCSV = () => flattenDataForCsv(filtered, type);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-screen max-w-none h-screen flex flex-col py-4"
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
                <TableHead>Keyword</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
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
