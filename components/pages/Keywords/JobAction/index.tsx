'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MoreHistoricalButton from '@/components/pages/Keywords/JobAction/MoreHistoricalButton';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';
import ConfirmDialog from '@/components/pages/Keywords/JobAction/ConfirmDialog';

const JobAction = ({ selectedItems }: { selectedItems: string[] }) => {
  const { toast } = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const [isChecking, setIsChecking] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [progress, setProgress] = useState(0);

  const processNextChunk = async (
    startIndex: number,
    totalKeywords: number
  ) => {
    try {
      if (isCancelled) {
        return;
      }

      const response = await axiosClient.post(
        `/api/keywords/check?startIndex=${startIndex}`,
        { items: selectedItems }
      );
      const {
        hasMore,
        nextIndex,
        processedKeywords,
        results,
        cancelled,
        totalKeywords: total,
      } = response.data;

      // Update progress
      const progressPercentage = Math.round(
        (processedKeywords / totalKeywords) * 100
      );
      setProgress(progressPercentage);

      // Show intermediate success message
      toast({
        title: 'Progress',
        description: `Processed ${processedKeywords} of ${totalKeywords} keywords (${progressPercentage}%)`,
      });

      // Continue processing if there are more keywords
      if (hasMore && nextIndex !== null && !cancelled) {
        await processNextChunk(nextIndex, totalKeywords);
      } else if (cancelled) {
        toast({
          title: 'Checking was stopped',
          description: `Completed processing  ${processedKeywords} keywords`,
        });
      } else {
        alert('a');
        toast({
          title: 'Success',
          description: `Completed processing all ${totalKeywords} keywords`,
        });
        setProgress(0);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCheckKeywords = useCallback(async () => {
    try {
      setIsChecking(true);
      setIsCancelled(false);
      setProgress(0);

      // Get initial response to get total keywords count
      const initialResponse = await axiosClient.post(
        '/api/keywords/check?startIndex=0',
        { items: selectedItems }
      );
      const { totalKeywords } = initialResponse.data;

      // Start processing with actual total
      await processNextChunk(0, totalKeywords);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check keywords',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
      setIsCancelled(false);
      setProgress(0);
    }
  }, [processNextChunk, toast, selectedItems]);

  const handleStopChecking = useCallback(async () => {
    setIsCancelled(true);
    await axiosClient.delete('/api/keywords/check');
    toast({
      title: 'Stopping',
      description: 'Stopping keyword check process...',
    });
  }, [toast]);

  const onCheckBtnBtnClick = useCallback(async () => {
    if (selectedItems?.length) {
      setShowConfirmModal(true);
    } else {
      await handleCheckKeywords();
    }
  }, [handleCheckKeywords, selectedItems?.length]);

  return (
    <Card className="py-3 my-3 flex items-center gap-4 border-0 shadow-none">
      <Button
        variant="secondary"
        className="bg-blue-300 text-blue-17 min-w-[200px] relative"
        onClick={onCheckBtnBtnClick}
        disabled={isChecking}
      >
        {isChecking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking... {progress}%
          </>
        ) : (
          'Check Keywords'
        )}
        {isChecking && progress > 0 && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        )}
      </Button>
      {isChecking && (
        <Button
          variant="secondary"
          className="bg-red-300 text-red-900 min-w-[100px]"
          onClick={handleStopChecking}
          disabled={isCancelled}
        >
          Stop
        </Button>
      )}
      <MoreHistoricalButton selectedItems={selectedItems} />
      <ConfirmDialog
        onActionHandle={handleCheckKeywords}
        type={'Check'}
        setIsOpen={setShowConfirmModal}
        isOpen={showConfirmModal}
        selectedCount={selectedItems?.length}
      />
    </Card>
  );
};

export default JobAction;
