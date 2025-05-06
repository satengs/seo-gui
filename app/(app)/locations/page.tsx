'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Search, Pin } from 'lucide-react';
import PageInfoItem from '@/components/shared/PageInfoItem';
import { MultiSelect, Option } from '@/components/ui/multi-select';

export default function LocationsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const options: Option[] = [
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'typescript', label: 'TypeScript' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Locations</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PageInfoItem
          title={'Total Locations'}
          icon={<Pin className="text-primary" />}
          statistic={'15'}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Example</CardTitle>
          <CardDescription>
            Select multiple programming languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MultiSelect
            options={options}
            selected={selected}
            onChange={(values) => {
              setSelected(values);
              // toast({
              //   title: 'Selection updated',
              //   description: `Selected: ${values.length ? values.join(', ') : 'None'}`,
              // });
            }}
            placeholder="Select languages..."
          />
          <div className="text-sm text-muted-foreground">
            Selected: {selected.length ? selected.join(', ') : 'None'}
          </div>
        </CardContent>
      </Card>

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
