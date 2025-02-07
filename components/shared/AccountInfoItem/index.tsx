import React from 'react';
import { Card } from '@/components/ui/card';
import { IAccount } from '@/types';

interface IAccountInfoItem {
  account: IAccount;
}

const AccountInfoItem: React.FC<IAccountInfoItem> = ({ account }) => {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          {account?.plan_searches_left} / {account?.searches_per_month} searches
        </p>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span>{account?.account_email?.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </Card>
  );
};

export default AccountInfoItem;
