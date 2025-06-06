'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';

interface IKeywordGroupingActionsProps {
  onResetGrouping: () => void;
}

const KeywordGroupingActions = () => {
  const { toast } = useToast();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const buttonsGroup = useMemo(
    () => [
      {
        id: 'term',
        btnLabel: ' Group by keyword',
      },
      {
        id: 'location',
        btnLabel: ' Group by location',
      },
      {
        id: 'device',
        btnLabel: ' Group by device',
      },
    ],
    []
  );

  // const handleStopChecking = useCallback(() => {
  //   setIsCancelled(true);
  //   toast({
  //     title: 'Stopping',
  //     description: 'Stopping keyword check process...',
  //   });
  // }, [toast]);

  const getKeywordsGroup = useCallback(async (id: string) => {
    try {
      const response = await axiosClient.get(
        `/api/keywords/group?groupBy=${id}`
      );
      console.log('response: ', response.data);
    } catch (err) {
      console.log('error: ', err);
    }
  }, []);

  const onKeywordGroupHandle = useCallback(
    async (id: string) => {
      if (activeButton === id) {
        setActiveButton(null);
      } else {
        setActiveButton(id);
        await getKeywordsGroup(id);
      }
    },
    [activeButton]
  );

  return (
    <Card className="py-3 my-3 flex items-center gap-4 border-0 shadow-none">
      {buttonsGroup?.length
        ? buttonsGroup.map((button) => (
            <Button
              key={button.id}
              variant="secondary"
              className={`${activeButton === button.id ? 'bg-blue-300 text-white hover:text-blue-17 hover:bg-blue-300' : 'border border-blue-300 text-blue-17'} min-w-[100px] relative`}
              onClick={() => onKeywordGroupHandle(button.id)}
            >
              {button?.btnLabel || ''}
            </Button>
          ))
        : null}
    </Card>
  );
};

export default KeywordGroupingActions;
