'use client';

import { useEffect, useState } from 'react';
import { Search, User } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import AccountInfoItem from './shared/AccountInfoItem';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { IAccount } from '@/types';

export default function Header() {
  const [account, setAccount] = useState<IAccount>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await axiosClient.get('/api/account');
        setAccount(response?.data);
      } catch (err) {
        console.error('Failed to fetch account:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch account data',
          variant: 'destructive',
        });
      }
    };

    fetchAccountData();
  }, [toast]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-3">
      <div className="flex h-14 items-center">
        <div className="mx-4 flex items-center">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="ml-2 text-xl font-semibold">Search Analytics</h1>
        </div>
        <div className="flex flex-1 items-center justify-between  md:justify-end">
          <div className="flex items-center space-x-2 mt-2 px-4">
            <ThemeToggle />
            {account && <AccountInfoItem account={account} />}
            {!account && (
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm font-medium">Loading...</p>
                  <p className="text-xs text-muted-foreground">
                    Fetching account data
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
