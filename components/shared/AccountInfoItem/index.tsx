import React from 'react';
import { Card } from '@/components/ui/card';
import { IAccount } from '@/types';
import { format } from 'date-fns';

interface IAccountInfoItem {
  account: IAccount;
}

const AccountInfoItem: React.FC<IAccountInfoItem> = ({ account }) => {
  // const { toast } = useToast();
  // const router = useRouter();

  // const handleLogOut = useCallback(async () => {
  //   try {
  //     await axiosClient.get('/api/auth/log-out');
  //     router.replace('/auth/sign-in');
  //     toast({
  //       title: 'Success',
  //       description: 'User successfully log out',
  //     });
  //   } catch (err) {
  //     toast({
  //       title: 'Failed',
  //       description: 'Log out failed ',
  //       variant: 'destructive',
  //     });
  //   }
  // }, [toast]);

  // Progress bar calculations
  const percent = account?.plan_searches_left && account?.searches_per_month
    ? (account.plan_searches_left / account.searches_per_month) * 100
    : 0;
  const barColor = 'bg-red-500';

  return (
    <Card className="py-2 border-0">
      <div className="flex items-center justify-between gap-4">
        {account?.lastSearchDate ? (
          <p className="text-sm font-medium text-muted-foreground border-x  px-4">
            Last searched at:{' '}
            {format(account?.lastSearchDate, 'yyyy-MM-dd HH:mm')}
          </p>
        ) : null}

        <div className="flex flex-col flex-1 min-w-[200px] max-w-xs">
          <div>
            <span className="font-bold text-sm">{account?.plan_searches_left?.toLocaleString() ?? 0}</span>
            <span className="text-gray-500 text-sm ml-1 font-medium">/ {account?.searches_per_month?.toLocaleString() ?? 0} searches</span>
          </div>
          <div className="w-full h-4 bg-red-500 rounded-full overflow-hidden mt-1 relative">
            <div
              className="h-full bg-green-500 transition-all absolute left-0 top-0 rounded-l-full rounded-r-none"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>
        {/*<Button variant={'ghost'} className={'px-0'} onClick={handleLogOut}>*/}
        {/*  <LogOut width={20} height={20} />*/}
        {/*</Button>*/}

        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span>{account?.account_email?.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </Card>
  );
};

export default AccountInfoItem;
