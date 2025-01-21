import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function CompetitorsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Competitors</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Competitor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search competitors..."
              className="w-full"
              type="search"
            />
          </div>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th className="px-6 py-3">Competitor</th>
                <th className="px-6 py-3">Domain</th>
                <th className="px-6 py-3">Shared Keywords</th>
                <th className="px-6 py-3">Avg. Position</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-6 py-4">Example Corp</td>
                <td className="px-6 py-4">example.com</td>
                <td className="px-6 py-4">245</td>
                <td className="px-6 py-4">2.8</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
