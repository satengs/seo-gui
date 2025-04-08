"use client";

import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bot, Search as ListSearch, Video, HelpCircle, MessageSquare } from 'lucide-react';

interface DataTypeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

const dataTypes = [
  {
    value: 'ai_overview',
    label: 'AI Overview',
    icon: Bot
  },
  {
    value: 'knowledge_graph',
    label: 'Knowledge Graph',
    icon: ListSearch
  },
  {
    value: 'inline_videos',
    label: 'Inline Videos',
    icon: Video
  },
  {
    value: 'related_questions',
    label: 'People Also Ask',
    icon: HelpCircle
  },
  {
    value: 'reddit',
    label: 'Reddit',
    icon: MessageSquare
  }
];

export default function DataTypeFilter({ value, onValueChange }: DataTypeFilterProps) {
  return (
      <div>
        <h4 className="text-sm font-medium mb-3">Data Type</h4>
        <ToggleGroup
            type="single"
            value={value}
            onValueChange={(value) => {
              if (value) onValueChange(value);
            }}
            className="inline-flex border rounded-lg divide-x shadow-[0_1px_3px_0_rgb(0,0,0,0.1)] bg-white"
        >
          {dataTypes.map((type) => {
            const Icon = type.icon;
            return (
                <ToggleGroupItem
                    key={type.value}
                    value={type.value}
                    aria-label={type.label}
                    className="flex items-center gap-2 px-4 py-2 first:rounded-l-md last:rounded-r-md border-0 data-[state=on]:bg-primary/5 data-[state=on]:text-primary hover:bg-muted/50 transition-colors border-primary/10"
                >
                  <Icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
  );
}