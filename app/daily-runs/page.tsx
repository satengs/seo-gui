'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, ArrowUpRight } from 'lucide-react';
import { PerformanceChart } from '@/components/ui/performance-chart';

const performanceData = [
  {
    date: 'Mon',
    success: 98,
    keywords: 1234,
  },
  {
    date: 'Tue',
    success: 97,
    keywords: 1240,
  },
  {
    date: 'Wed',
    success: 99,
    keywords: 1245,
  },
  {
    date: 'Thu',
    success: 98,
    keywords: 1238,
  },
  // {
  //   date: "Fri",
  //   success: 96,
  //   keywords: 1242,
  // },
];

const chartLines = [
  { key: 'success', color: '--chart-1', name: 'Success Rate (%)' },
  { key: 'keywords', color: '--chart-2', name: 'Keywords Tracked' },
];

export default function DailyRunsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daily Runs</h1>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Select Date Range
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Success Rate
              </p>
              <h2 className="text-2xl font-bold">98%</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>2% from last week</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Keywords Tracked
              </p>
              <h2 className="text-2xl font-bold">1,234</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Daily Performance</h3>
          <PerformanceChart
            data={performanceData}
            lines={chartLines}
            height={300}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-muted rounded-lg">
              <div className="ml-4">
                <p className="font-medium">Ranking Change Alert</p>
                <p className="text-sm text-muted-foreground">
                  "SEO Analytics" dropped 3 positions
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-muted rounded-lg">
              <div className="ml-4">
                <p className="font-medium">New Competitor Detected</p>
                <p className="text-sm text-muted-foreground">
                  Found overlap with example.com
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
