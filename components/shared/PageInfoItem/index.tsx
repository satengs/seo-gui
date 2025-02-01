import React, { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface IPageInfoItem {
  title: string;
  icon: ReactNode;
  statistic: string | number;
  successStatus?: string;
  failedStatus?: string;
}

const PageInfoItem: React.FC<IPageInfoItem> = ({
  title,
  statistic,
  icon,
  successStatus,
  failedStatus,
}) => {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="text-2xl font-bold">{statistic}</h2>
        </div>
        <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      {successStatus ? (
        <div className="mt-4 flex items-center text-sm text-green-600">
          <ArrowUpRight className="mr-1 h-4 w-4" />
          <span>{successStatus}</span>
        </div>
      ) : null}
      {failedStatus ? (
        <div className="mt-4 flex items-center text-sm text-green-600">
          <ArrowDownRight className="mr-1 h-4 w-4" />
          <span>{failedStatus}</span>
        </div>
      ) : null}
    </Card>
  );
};

export default PageInfoItem;
