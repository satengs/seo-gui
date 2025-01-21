import { Card } from '@/components/ui/card';
import { Map, Globe } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Map API Analytics</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Locations
              </p>
              <h2 className="text-2xl font-bold">324</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Map className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Regions
              </p>
              <h2 className="text-2xl font-bold">12</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
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
