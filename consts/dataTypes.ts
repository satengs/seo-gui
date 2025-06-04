import {
  Bot,
  Search as ListSearch,
  Video,
  HelpCircle,
  MessageSquare,
  StickyNote,
} from 'lucide-react';

export const dataTypes = [
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
  {
    value: 'discussions_and_forums',
    label: 'Discussions and forums',
    icon: StickyNote,
  },
] as const;

export type DataType = (typeof dataTypes)[number]['value'];
