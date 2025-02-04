import { BarChart3, TrendingUp, KeyRound, Users } from 'lucide-react';
import PageInfoItem from '@/components/shared/PageInfoItem';

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Overview Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <PageInfoItem
          title={'Total Keywords'}
          icon={<KeyRound className="text-primary" />}
          statistic={'1,234'}
          successStatus={'12% from last month'}
        />
        <PageInfoItem
          title={'Average Ranking'}
          icon={<TrendingUp className=" text-primary" />}
          statistic={'4.2'}
          failedStatus={'3% from last month'}
        />
        <PageInfoItem
          title={'Total Competitors'}
          icon={<Users className="text-primary" />}
          statistic={'15'}
          successStatus={'2 new this month'}
        />

        <PageInfoItem
          title={'Daily Runs'}
          icon={<BarChart3 className="text-primary" />}
          statistic={'98%'}
          successStatus={'Healthy'}
        />
      </div>
    </div>
  );
}
