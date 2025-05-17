import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import CustomProgressBar from '@/components/shared/CustomProgressBar';
import { IAccount } from '@/types';

interface IAccountInfoItem {
  account: IAccount;
}

const AccountInfoItem: React.FC<IAccountInfoItem> = ({ account }) => {
  return (
    <Card className="py-2 border-0">
      <div className="flex items-center justify-between gap-4">
        {account?.lastSearchDate ? (
          <p className="text-sm font-medium text-muted-foreground border-x px-4">
            Last searched at:{' '}
            {format(account?.lastSearchDate, 'yyyy-MM-dd HH:mm')}
          </p>
        ) : null}

        <CustomProgressBar
          total={account?.searches_per_month}
          remaining={account?.plan_searches_left}
          containerClassName={'w-44'}
        />
        <div className="h-10 max-w-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span>{account?.account_email?.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </Card>
  );
};

export default AccountInfoItem;
