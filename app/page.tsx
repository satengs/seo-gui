import { Card } from '@/components/ui/card';
import {
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  KeyRound,
  Users,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Overview Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Keywords
              </p>
              <h2 className="text-2xl font-bold">1,234</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>12% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Ranking
              </p>
              <h2 className="text-2xl font-bold">4.2</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-red-600">
            <ArrowDownRight className="mr-1 h-4 w-4" />
            <span>3% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Competitors
              </p>
              <h2 className="text-2xl font-bold">15</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>2 new this month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Daily Runs
              </p>
              <h2 className="text-2xl font-bold">98%</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>Healthy</span>
          </div>
        </Card>
      </div>

      {/* Add more dashboard sections here */}
    </div>
  );
}
