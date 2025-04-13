'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, MessageSquare, ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';

interface SlidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  type: 'ai_overview' | 'reddit';
}

export default function SlidePanel({
  open,
  onOpenChange,
  data,
  type,
}: SlidePanelProps) {
  if (!data) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[540px] overflow-hidden flex flex-col">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            {type === 'ai_overview' ? (
              <Bot className="h-5 w-5 text-primary" />
            ) : (
              <MessageSquare className="h-5 w-5 text-primary" />
            )}
            <SheetTitle>
              {type === 'ai_overview' ? 'AI Overview' : 'Reddit Discussions'}
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-1">
          {type === 'ai_overview' && data.references && (
            <div className="py-6 space-y-6">
              {data.references.map((ref: any, index: number) => (
                <div key={index} className="space-y-2">
                  <Link
                    href={ref.link}
                    target="_blank"
                    className="text-lg font-medium hover:underline flex items-center gap-2"
                  >
                    {ref.title}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <p className="text-sm text-muted-foreground">{ref.snippet}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">{ref.source}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === 'reddit' && data.discussions_and_forums && (
            <div className="py-6 space-y-6">
              {data.discussions_and_forums
                .filter((item: any) => item.source === 'Reddit')
                .map((discussion: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <Link
                      href={discussion.link}
                      target="_blank"
                      className="text-lg font-medium hover:underline flex items-center gap-2"
                    >
                      {discussion.title}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {discussion.snippet}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(discussion.date).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{discussion.votes} votes</span>
                      <span>•</span>
                      <span>{discussion.comments} comments</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
