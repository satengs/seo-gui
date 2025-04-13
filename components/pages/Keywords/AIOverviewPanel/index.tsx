"use client";

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
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
import { ArrowLeft, Brain, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { filterKeywordsByType } from '../../../../lib/utils';

interface AiOverviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: "ai_overview" | "related_questions" | "reddit" | "inline_videos" | "knowledge_graph";
}
export default function AiOverviewPanel({
                                          isOpen,
                                          onClose,
                                          data,
                                          type
                                        }: AiOverviewPanelProps) {
  const filtered = filterKeywordsByType(data, type);
  const renderRows = () => {
    return filtered.flatMap((row: any, index: number) => {
      if (type === "ai_overview") {
        const historicalDates = Object.keys(row.historicalData || {});
        return historicalDates.flatMap((date) => {
          const aiOverview = row.historicalData[date]?.keywordData?.data?.ai_overview ?? {};
          const reference = aiOverview.references?.[0];

          if (!reference) return [];

          return (
            <TableRow key={`${index}-${date}-ref`}>
              <TableCell>{row.term}</TableCell>
              <TableCell>{row.device}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>{reference.source}</TableCell>
              <TableCell>{reference.snippet}</TableCell>
              <TableCell>{reference.title}</TableCell>
              <TableCell>
                <Link href={reference.link} target="_blank" className="text-blue-600 hover:underline">View</Link>
              </TableCell>
            </TableRow>
          );
        });
      }
      if (type === "related_questions") {
        const historicalDates = Object.keys(row.historicalData || {});
        return historicalDates.flatMap((date) => {
          const relatedQuestions = row.historicalData[date]?.keywordData?.data?.related_questions ?? {};
          console.log('relatedQuestions', relatedQuestions)

          if (!relatedQuestions) return [];

          return (
            <TableRow>
              <TableCell>{row.term}</TableCell>
              <TableCell>{row.device}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>{relatedQuestions[0]?.question || "-"}</TableCell>
              <TableCell className="max-w-[300px] truncate">{relatedQuestions[0]?.snippet || "-"}</TableCell>
              <TableCell>{relatedQuestions[0]?.title || "-"}</TableCell>
              <TableCell>
                {relatedQuestions[0]?.link ? (
                  <Link href={relatedQuestions[0].link} target="_blank"
                        className="flex items-center hover:text-primary">
                    View <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                ) : "-"}
              </TableCell>
              <TableCell>
                <ul className="list-disc list-inside">
                  {(relatedQuestions[0]?.list || []).map((li: string, i: number) => (
                    <li key={i} className="truncate">{li}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>{relatedQuestions[0]?.displayed_link || "-"}</TableCell>
            </TableRow>
          );
        });
      }
      if (type === "reddit") {
        const historicalDates = Object.keys(row.historicalData || {});
        return historicalDates.flatMap((date) => {
          const redditResults = row.historicalData[date]?.keywordData?.data?.organic_results ?? [];

          const redditFiltered = redditResults.filter(
            (result: any) =>
              typeof result?.source === 'string' &&
              /\breddit\b/i.test(result.source.toLowerCase())
          );

          return redditFiltered.map((result: any, i: number) => (
            <TableRow key={`${index}-${date}-ref-${i}`}>
              <TableCell>{row.term}</TableCell>
              <TableCell>{row.device}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>{result?.title || "-"}</TableCell>
              <TableCell>{result?.snippet || "-"}</TableCell>
              <TableCell>
                {result?.link ? (
                  <Link
                    href={result.link}
                    target="_blank"
                    className="flex items-center hover:text-primary"
                  >
                    View <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                ) : "-"}
              </TableCell>
              <TableCell>{result?.source || "-"}</TableCell>
            </TableRow>
          ));
        });
      }
      if (type === "inline_videos") {
        const historicalDates = Object.keys(row.historicalData || {});
        return historicalDates.flatMap((date) => {
          const videos = row.historicalData[date]?.keywordData?.data?.inline_videos ?? [];

          if (!Array.isArray(videos) || videos.length === 0) return [];

          return (
            <TableRow key={`${index}-${date}-video-`}>
              <TableCell>{row.term}</TableCell>
              <TableCell>{row.device}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>{videos[0].title || "-"}</TableCell>
              <TableCell>{videos[0].thumbnail || "-"}</TableCell>
              <TableCell>
                {videos[0].link ? (
                  <Link href={videos[0].link} target="_blank" className="flex items-center hover:text-primary">
                    View <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                ) : "-"}
              </TableCell>
              <TableCell>{videos[0].duration || "-"}</TableCell>
            </TableRow>
          )
        });
      }
      if (type === "knowledge_graph") {
        const historicalDates = Object.keys(row.historicalData || {});
        return historicalDates.flatMap((date) => {
          const graph = row.historicalData[date]?.keywordData?.data?.knowledge_graph ?? {};

          if (!graph) return [];

          return (
            <TableRow key={`${index}-${date}-video-`}>
              <TableCell>{row.term}</TableCell>
              <TableCell>{row.device}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{date}</TableCell>
              <TableCell>{graph.title || "-"}</TableCell>
              <TableCell>{graph.type || "-"}</TableCell>
              <TableCell>{graph.kgmid || "-"}</TableCell>
              <TableCell>
                {graph.knowledge_graph_search_link ? (
                  <Link href={graph.knowledge_graph_search_link} target="_blank" className="flex items-center hover:text-primary">
                    View <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                ) : "-"}
              </TableCell>
              <TableCell>{graph.website || "-"}</TableCell>
              <TableCell>{graph.customer_service || "-"}</TableCell>
              <TableCell>{graph.date_founded || "-"}</TableCell>
              <TableCell>{graph.president || "-"}</TableCell>
            </TableRow>
          )
        });
      }

    })

  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-screen max-w-none overflow-x-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <SheetTitle className="flex items-center capitalize">
              {type.replace('_', ' ')}
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className='overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                {type === "ai_overview" && (
                  <>
                    <TableHead>Source</TableHead>
                    <TableHead>Snippet</TableHead>
                    <TableHead>Reference Title</TableHead>
                    <TableHead>Reference Link</TableHead>
                  </>
                )}
                {type === "related_questions" && (
                  <>
                    <TableHead>Question</TableHead>
                    <TableHead>Snippet</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>List Items</TableHead>
                    <TableHead>Displayed Link</TableHead>
                  </>
                )}
                {type === "reddit" && (
                  <>
                    <TableHead>Title</TableHead>
                    <TableHead>Snippet</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Source</TableHead>
                  </>
                )}
                {type === "inline_videos" && (
                  <>
                    <TableHead>Title</TableHead>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Duration</TableHead>
                  </>
                )}
      {type === "knowledge_graph" && (
                  <>
                    <TableHead>Title</TableHead>
                    <TableHead>type</TableHead>
                    <TableHead>kgmid</TableHead>
                    <TableHead>knowledge_graph_search_link</TableHead>
                    <TableHead>website</TableHead>
                    <TableHead>customer_service</TableHead>
                    <TableHead>ate_founded</TableHead>
                    <TableHead>president</TableHead>

                  </>
                )}

              </TableRow>
            </TableHeader>
            <TableBody>{renderRows()}</TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
