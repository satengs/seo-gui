'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Calendar,
  Link as LinkIcon,
  Search,
  Globe,
  Bot,
  Info,
  Search as ListSearch,
  Image as ImageIcon,
  HelpCircle,
  Newspaper,
  Link2,
  Sparkles,
  Video,
  MessageSquare,
  MessagesSquare,
  PlayCircle,
  Map as MapIcon,
  MapPinned,
  Menu,
  Star,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface JsonViewerProps {
  data: any;
  level?: number;
  isHistoricalData?: boolean;
  isExpanded?: boolean;
}

interface InputValueData {
  _id: string;
  data: object;
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  level = 0,
  isHistoricalData = false,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [expandedHistoricalItems, setExpandedHistoricalItems] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = useCallback((key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const toggleHistoricalItem = useCallback((date: string) => {
    setExpandedHistoricalItems((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  }, []);

  const renderValue = useCallback((value: any, isKey: boolean = false) => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === 'boolean')
      return <span className="text-purple-600">{value.toString()}</span>;
    if (typeof value === 'number')
      return <span className="text-blue-600">{value.toLocaleString()}</span>;
    if (typeof value === 'string') {
      // Handle dates
      const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (datePattern.test(value)) {
        return (
          <span className="text-green-600 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(value).toLocaleString()}
          </span>
        );
      }
      // Handle URLs
      if (value.startsWith('http')) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center gap-1"
          >
            <LinkIcon className="h-3 w-3" />
            {new URL(value).hostname}
          </a>
        );
      }
      return (
        <span className={isKey ? 'text-purple-600' : 'text-green-600'}>
          {isKey ? `"${value}": ` : `"${value}"`}
        </span>
      );
    }
    return null;
  }, []);

  const getKeyIcon = useCallback((key: string) => {
    switch (key.toLowerCase()) {
      case 'search_information':
        return <Info className="h-4 w-4 text-blue-800" />;
      case 'knowledge_graph':
        return <ListSearch className="h-4 w-4 text-purple-800" />;
      case 'inline_images':
        return <ImageIcon className="h-4 w-4 text-green-800" />;
      case 'inline_videos':
        return <Video className="h-4 w-4 text-yellow-800" />;
      case 'perspectives':
        return <MessageSquare className="h-4 w-4 text-violet-800" />;
      case 'discussions_and_forums':
        return <MessagesSquare className="h-4 w-4 text-fuchsia-800" />;
      case 'short_videos':
        return <PlayCircle className="h-4 w-4 text-rose-800" />;
      case 'ads':
        return <Target className="h-4 w-4 text-lime-800" />;
      case 'local_map':
        return <MapPinned className="h-4 w-4 text-teal-800" />;
      case 'local_results':
        return <MapIcon className="h-4 w-4 text-emerald-800" />;
      case 'menu_highlights':
        return <Menu className="h-4 w-4 text-amber-800" />;
      case 'related_questions':
        return <HelpCircle className="h-4 w-4 text-orange-800" />;
      case 'ai_overview':
        return <Bot className="h-4 w-4 text-emerald-800" />;
      case 'top_stories':
        return <Newspaper className="h-4 w-4 text-red-800" />;
      case 'top_stories_link':
        return <Link2 className="h-4 w-4 text-indigo-800" />;
      case 'top_stories_serpapi_link':
        return <LinkIcon className="h-4 w-4 text-pink-800" />;
      case 'related_searches':
        return <Sparkles className="h-4 w-4 text-cyan-800" />;
      case 'reviews':
        return <Star className="h-4 w-4 text-orange-800" />;
      case 'search_parameters':
        return <Globe className="h-4 w-4 text-gray-700" />;
      case 'data':
      case 'keyworddata':
        return <Search className="h-4 w-4 text-gray-700" />;
      default:
        return null;
    }
  }, []);

  const renderHistoricalData = useCallback(
    (date: string, data: any) => {
      const isExpanded = expandedHistoricalItems[date];

      return (
        <div key={date} className="border-b border-gray-300 last:border-b-0">
          <div
            className="flex items-center gap-2 py-2 cursor-pointer hover:bg-cyan-200 px-2"
            onClick={(e) => {
              e.stopPropagation();
              toggleHistoricalItem(date);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-medium text-sm text-gray-600">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
          {isExpanded && (
            <div className="pl-8 pr-4 pb-2">
              {Object.entries(data).map(([key, value]) => {
                const isObject = typeof value === 'object' && value !== null;
                const icon = getKeyIcon(key);

                return (
                  <div key={key} className="py-1">
                    <div
                      className={cn(
                        'flex items-start gap-2',
                        isObject && 'cursor-pointer hover:text-primary'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isObject) {
                          toggleExpand(key);
                        }
                      }}
                    >
                      {isObject && (
                        <span className="text-muted-foreground mt-1">
                          {expandedKeys[key] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </span>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground flex items-center gap-1">
                            {icon}
                            {key}:
                          </span>
                          {!isObject && renderValue(value)}
                        </div>
                        {isObject && expandedKeys[key] && (
                          <div className="mt-2 pl-4 border-l-2 border-muted border-gray-500">
                            <JsonViewer data={value} level={level + 1} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    },
    [expandedHistoricalItems, expandedKeys, renderValue, level, getKeyIcon]
  );

  const processData = useCallback((inputData: any) => {
    if (inputData instanceof Map) {
      return Object.fromEntries(inputData);
    }
    if (Array.isArray(inputData)) {
      return inputData;
    }
    if (typeof inputData === 'object' && inputData !== null) {
      const processed: any = {};
      for (const [key, value] of Object.entries(inputData)) {
        if (key === 'keywordData' && typeof value === 'object') {
          // Handle keywordData object
          const typedValue = value as InputValueData;
          processed[key] = (typedValue?.data as InputValueData) || value;
        } else if (key === 'data' && typeof value === 'object') {
          // Handle nested SERP API response data
          processed[key] = value;
        } else {
          processed[key] =
            value instanceof Map ? Object.fromEntries(value) : value;
        }
      }
      return processed;
    }
    return inputData;
  }, []);

  const content = useMemo(() => {
    const processedData = processData(data);

    if (processedData === null || typeof processedData !== 'object') {
      return renderValue(processedData);
    }

    const isArray = Array.isArray(processedData);
    const isEmpty = Object.keys(processedData).length === 0;

    if (isEmpty) {
      return <span>{isArray ? '[]' : '{}'}</span>;
    }

    if (isHistoricalData) {
      return Object.entries(processedData)
        .sort(
          ([dateA], [dateB]) =>
            new Date(dateB).getTime() - new Date(dateA).getTime()
        )
        .map(([date, value]) => renderHistoricalData(date, value));
    }

    return Object.entries(processedData).map(([key, value]) => {
      const isObject = typeof value === 'object' && value !== null;
      const isExpanded = expandedKeys[key];
      const isHistoricalKey = key === 'historicalData';
      const icon = getKeyIcon(key);

      return (
        <div key={key} className={cn('py-1', level > 0 && 'ml-4')}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (isObject) {
                toggleExpand(key);
              }
            }}
            className={cn(
              'flex items-center gap-1',
              isObject && 'cursor-pointer hover:text-primary'
            )}
          >
            {isObject && (
              <span className="text-muted-foreground">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
            <span className="flex items-center gap-1">
              {icon}
              {renderValue(key, true)}
            </span>
            {!isObject && renderValue(value)}
            {isObject && !isExpanded && (
              <span className="text-muted-foreground text-sm">
                {isArray ? '[...]' : '{...}'}
              </span>
            )}
          </div>
          {isObject && isExpanded && (
            <div
              className={cn(
                'border-l-2 border-muted border-gray-500 ml-2 pl-2',
                isHistoricalKey && 'border-0 ml-0 pl-0'
              )}
            >
              <JsonViewer
                data={value}
                level={level + 1}
                isHistoricalData={isHistoricalKey}
              />
            </div>
          )}
        </div>
      );
    });
  }, [
    data,
    level,
    expandedKeys,
    renderValue,
    renderHistoricalData,
    processData,
    getKeyIcon,
  ]);

  return (
    <div
      className={cn(
        'font-mono',
        isHistoricalData && 'bg-cyan-100 px-1 rounded-md overflow-hidden'
      )}
    >
      {content}
    </div>
  );
};

export default React.memo(JsonViewer);
