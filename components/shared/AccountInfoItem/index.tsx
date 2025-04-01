import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import axiosClient from '@/lib/axiosClient';
import { IAccount } from '@/types';

interface IAccountInfoItem {
  account: IAccount;
}

const AccountInfoItem: React.FC<IAccountInfoItem> = ({ account }) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleLogOut = useCallback(async () => {
    try {
      await axiosClient.get('/api/auth/log-out');
      router.replace('/auth/sign-in');
      toast({
        title: 'Success',
        description: 'User successfully log out',
      });
    } catch (err) {
      toast({
        title: 'Failed',
        description: 'Log out failed ',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return (
    <Card className="py-2 border-0">
      <div className="flex items-center justify-between gap-4">
        {account?.lastSearch ? (
          <p className="text-sm font-medium text-muted-foreground border-x  px-4">
            Last searched at:{' '}
            {format(account?.lastSearch?.updatedAt, 'yyyy-MM-dd HH:mm')}
          </p>
        ) : null}

        <p className="text-sm font-medium text-muted-foreground">
          {account?.plan_searches_left} / {account?.searches_per_month} searches
        </p>

        <Button variant={'ghost'} className={'px-0'} onClick={handleLogOut}>
          <LogOut width={20} height={20} />
        </Button>

        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span>{account?.account_email?.charAt(0).toUpperCase()}</span>
        </div>
      </div>
    </Card>
  );
};

export default AccountInfoItem;
