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
        />
        {/*<p className="text-sm font-medium text-muted-foreground">*/}
        {/*  {account?.plan_searches_left} / {account?.searches_per_month} searches*/}
        {/*</p>*/}

        {/*<Button variant={'ghost'} className={'px-0'} onClick={handleLogOut}>*/}
        {/*  <LogOut width={20} height={20} />*/}
        {/*</Button>*/}

        <div className="h-10 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <span>{account?.account_email?.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </Card>
  );
};

export default AccountInfoItem;
