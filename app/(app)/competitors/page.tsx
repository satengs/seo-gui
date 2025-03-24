import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Search } from 'lucide-react';
import PageInfoItem from '@/components/shared/PageInfoItem';

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
        <PageInfoItem
          title={' Total Competitors'}
          icon={<Users className="text-primary" />}
          statistic={'15'}
          successStatus={'2 new this month'}
        />
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
