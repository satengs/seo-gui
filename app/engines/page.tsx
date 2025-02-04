'use client';

import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { PerformanceChart } from '@/components/ui/performance-chart';
import PageInfoItem from '@/components/shared/PageInfoItem';

const performanceData = [
  {
    date: '2024-01',
    google: 82,
    bing: 12,
    other: 6,
  },
  {
    date: '2024-02',
    google: 80,
    bing: 13,
    other: 7,
  },
  {
    date: '2024-03',
    google: 85,
    bing: 11,
    other: 4,
  },
  {
    date: '2024-04',
    google: 82,
    bing: 12,
    other: 6,
  },
];

const chartLines = [
  { key: 'google', color: '--chart-1', name: 'Google' },
  { key: 'bing', color: '--chart-2', name: 'Bing' },
  { key: 'other', color: '--chart-3', name: 'Other Engines' },
];

export default function EnginesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Search Engines</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PageInfoItem
          title={'Google'}
          icon={<Search className="text-primary" />}
          statistic={'82%'}
          successStatus={'5% from last month'}
        />
        <PageInfoItem
          title={'Bing'}
          icon={<Search className="text-primary" />}
          statistic={'12%'}
          failedStatus={'2% from last month'}
        />
        <PageInfoItem
          title={'Other Engines'}
          icon={<Search className="text-primary" />}
          statistic={'6%'}
          successStatus={'1% from last month'}
        />
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Performance Trends</h3>
          <PerformanceChart data={performanceData} lines={chartLines} />
        </Card>
      </div>
    </div>
  );
}
