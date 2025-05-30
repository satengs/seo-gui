import React, { useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosClient from '@/lib/axiosClient';
import { useToast } from '@/hooks/use-toast';
import ConfirmDialog from '@/components/pages/Keywords/JobAction/ConfirmDialog';
export const STATUS_CHECK_INTERVAL = 5000;

interface IMoreHistoricalButtonProps {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const MoreHistoricalButton = ({
  selectedItems,
  setSelectedItems,
}: IMoreHistoricalButtonProps) => {
  const { toast } = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isHistoricalFetching, setIsHistoricalFetching] = useState(false);
  const [processedPercent, setProcessedPercent] = useState<number>(0);
  const [totalProcessed, setTotalProcessed] = useState<number>(0);
  const [, setCurrentChunk] = useState<number>(0);

  const updateToast = useCallback(
    (processedCount: number, processedTotal: number) => {
      if (processedCount > 0) {
        toast({
          title: 'Processing Update',
          description: `Processed ${processedCount} of ${processedTotal} keywords`,
        });
      }
    },
    [toast]
  );

  const checkStatus = useCallback(async () => {
    try {
      const response = await axiosClient.post(
        `/api/keywords/historical-more?action=status`,
        { items: [] }
      );
      const { isProcessing, processedPercent, processedTotal, processedCount } =
        response?.data || {};
      setIsHistoricalFetching(isProcessing);

      if (isProcessing) {
        setTimeout(checkStatus, STATUS_CHECK_INTERVAL);
      }
      setProcessedPercent(Math.round(processedPercent || 0));
      if (totalProcessed === 0) {
        setTotalProcessed(Math.round(processedTotal || 0));
      }
      const newChunk = Math.floor(processedCount / 10) + 1;
      setCurrentChunk((prevChunk) => {
        if (newChunk !== prevChunk && processedCount > 0) {
          updateToast(processedCount, processedTotal);
        }
        return newChunk;
      });
      if (processedCount === processedTotal && isProcessing) {
        toast({
          title: 'Success',
          description: `Completed processing all ${totalProcessed} keywords`,
        });
        if (selectedItems?.length) {
          setSelectedItems([]);
        }
      }
    } catch (error) {
      console.error('Failed to check status:', error);
      toast({
        title: 'Error',
        description: 'Failed to check processing status',
      });
    }
  }, [
    totalProcessed,
    updateToast,
    toast,
    selectedItems?.length,
    setSelectedItems,
  ]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleGetMoreHistorical = useCallback(async () => {
    try {
      await axiosClient.post(`/api/keywords/historical-more?action=start`, {
        items: selectedItems,
      });
      setIsHistoricalFetching(true);
      setCurrentChunk(0);
      setTotalProcessed(0);
      toast({
        title: 'Processing Started',
        description: 'Starting to fetch more historical data',
      });
      checkStatus();
    } catch (error) {
      console.error('Failed to start processing:', error);
      toast({
        title: 'Error',
        description: 'Failed to start processing',
      });
    }
  }, [checkStatus, toast, selectedItems]);

  const onGetMoreBtnClick = useCallback(async () => {
    if (selectedItems?.length) {
      setShowConfirmModal(true);
    } else {
      await handleGetMoreHistorical();
    }
  }, [handleGetMoreHistorical, selectedItems?.length]);

  const handleCancelHistorical = useCallback(async () => {
    try {
      await axiosClient.post(`/api/keywords/historical-more?action=stop`, {
        items: [],
      });
      toast({
        title: 'Processing Stopped',
        description: 'Processing will stop after the current chunk completes',
      });
    } catch (error) {
      console.error('Failed to stop processing:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop processing',
      });
    } finally {
      if (selectedItems?.length) {
        setSelectedItems([]);
      }
    }
  }, [toast, selectedItems?.length, setSelectedItems]);

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant={'secondary'}
        className="bg-orange-200 text-blue-17 min-w-[200px] relative hover:bg-orange-100"
        onClick={onGetMoreBtnClick}
        disabled={isHistoricalFetching}
      >
        {isHistoricalFetching ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Fetching... {processedPercent}%</span>
          </div>
        ) : (
          'Get more historical'
        )}
      </Button>

      {isHistoricalFetching && (
        <Button
          variant="secondary"
          className="bg-red-300 text-red-900 min-w-[100px]"
          onClick={handleCancelHistorical}
        >
          Stop
        </Button>
      )}
      <ConfirmDialog
        type={'Get historical'}
        onActionHandle={handleGetMoreHistorical}
        setIsOpen={setShowConfirmModal}
        isOpen={showConfirmModal}
        selectedCount={selectedItems?.length}
      />
    </div>
  );
};

export default React.memo(MoreHistoricalButton);
