'use client';

import { Card } from '@/components/ui/card';
import { Search, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PerformanceChart } from '@/components/ui/performance-chart';

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
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Google
              </p>
              <h2 className="text-2xl font-bold">82%</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>5% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bing</p>
              <h2 className="text-2xl font-bold">12%</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-red-600">
            <ArrowDownRight className="mr-1 h-4 w-4" />
            <span>2% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Other Engines
              </p>
              <h2 className="text-2xl font-bold">6%</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>1% from last month</span>
          </div>
        </Card>
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
