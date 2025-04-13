'use client';

import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Bot,
  Search as ListSearch,
  Video,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import AiOverviewPanel from '@/components/pages/Keywords/AIOverviewPanel';

interface DataTypeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

const dataTypes = [
  {
    value: 'ai_overview',
    label: 'AI Overview',
    icon: Bot,
  },
  {
    value: 'knowledge_graph',
    label: 'Knowledge Graph',
    icon: ListSearch,
  },
  {
    value: 'inline_videos',
    label: 'Inline Videos',
    icon: Video,
  },
  {
    value: 'related_questions',
    label: 'People Also Ask',
    icon: HelpCircle,
  },
  {
    value: 'reddit',
    label: 'Reddit',
    icon: MessageSquare,
  },
];

const dataMap: Record<string, any> = {
  ai_overview: {
    label: 'Ai',
    analysis: 'This is AI overview content.',
    metrics: {
      avgPosition: '3.2',
      prevAvgPosition: '4.5',
      positionChange: 1.3,
      ctr: '4.5%',
      prevCtr: '3.8%',
      ctrChange: 0.7,
      volume: '13,000',
      prevVolume: '11,000',
      volumeChange: 2000,
    },
    recommendations: ['Optimize headings', 'Improve structured data'],
  },
  related_questions: {
    analysis: 'This is People Also Ask data.',
    metrics: {
      avgPosition: '5.1',
      prevAvgPosition: '6.4',
      positionChange: 1.3,
      ctr: '3.0%',
      prevCtr: '2.4%',
      ctrChange: 0.6,
      volume: '10,200',
      prevVolume: '9,800',
      volumeChange: 400,
    },
    recommendations: ['Answer related questions clearly', 'Use FAQ schema'],
  },
  reddit: {
    analysis: 'This is Reddit mentions analysis.',
    metrics: {
      avgPosition: '8.1',
      prevAvgPosition: '7.8',
      positionChange: -0.3,
      ctr: '1.8%',
      prevCtr: '2.1%',
      ctrChange: -0.3,
      volume: '5,000',
      prevVolume: '5,200',
      volumeChange: -200,
    },
    recommendations: [
      'Engage on relevant subreddits',
      'Improve brand visibility',
    ],
  },
};

export default function DataTypeFilter({
  value,
  onValueChange,
  keywords,
}: DataTypeFilterProps) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
console.log('keywords', keywords)
  const handleValueChange = (newValue: string) => {
    if (
      [
        'ai_overview',
        'related_questions',
        'reddit',
        'inline_videos',
        'knowledge_graph',
      ].includes(newValue)
    ) {
      setOpenPanel(newValue);
    }
    onValueChange(newValue);
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Data Type</h4>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={handleValueChange}
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

      {dataTypes.map(
        (type, i) =>
          openPanel && (
            <AiOverviewPanel
              key={`dk-${i}`}
              isOpen={!!openPanel}
              onClose={() => setOpenPanel(null)}
              type={openPanel}
data={keywords}
            />
          )
      )}
    </div>
  );
}
