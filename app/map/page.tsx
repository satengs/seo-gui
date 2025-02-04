import { Card } from '@/components/ui/card';
import { Map, Globe } from 'lucide-react';
import PageInfoItem from '@/components/shared/PageInfoItem';

export default function MapPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Map API Analytics</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PageInfoItem
          title={'Total Locations'}
          icon={<Map className="text-primary" />}
          statistic={'324'}
        />
        <PageInfoItem
          title={'Active Regions'}
          icon={<Globe className="text-primary" />}
          statistic={'12'}
        />
      </div>

      <div className="mt-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            Geographic Distribution
          </h3>
          <div className="h-[600px] flex items-center justify-center text-muted-foreground">
            Map visualization will be implemented here
          </div>
        </Card>
      </div>
    </div>
  );
}
