import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/pages/Keywords/JobAction/ConfirmDialog';
import axiosClient from '@/lib/axiosClient';
import { useToast } from '@/hooks/use-toast';

export const STATUS_CHECK_INTERVAL = 5000;

interface IMoreHistoricalButtonProps {
  selectedItems: string[];
  clearSelected: () => void;
}

const MoreHistoricalButton = ({
  selectedItems,
  clearSelected,
}: IMoreHistoricalButtonProps) => {
  const { toast } = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isHistoricalFetching, setIsHistoricalFetching] = useState(false);
  const [processedPercent, setProcessedPercent] = useState<number>(0);
  const statusCheckTimerRef = useRef<number | null>(null);
  const lastToastRef = useRef<number>(0);
  const wasProcessingRef = useRef<boolean>(false);
  const toastThresholdRef = useRef<number>(10); // Show toast every 10% progress
  const jobIdRef = useRef<string | null>(null);

  const showProgressToast = useCallback(
    (count: number, total: number) => {
      const currentPercent = Math.round((count / total) * 100);
      if (currentPercent >= lastToastRef.current + toastThresholdRef.current) {
        toast({
          title: 'Processing Update',
          description: `Processed ${count} of ${total} keywords`,
        });
        lastToastRef.current = currentPercent;
      }
    },
    [toast]
  );

  const checkStatus = useCallback(async () => {
    try {
      const response = await axiosClient.post(
        `/api/keywords/historical-more?action=status`,
        {
          items: selectedItems,
          jobId: jobIdRef.current,
        }
      );

      const {
        isProcessing,
        processedPercent,
        processedTotal,
        processedCount,
        jobId,
      } = response?.data || {};

      setIsHistoricalFetching(isProcessing);
      setProcessedPercent(Math.round(processedPercent || 0));
      if (jobId && !jobIdRef.current) {
        wasProcessingRef.current = false;
        jobIdRef.current = jobId;
      }

      if (isProcessing) {
        wasProcessingRef.current = true;
        showProgressToast(processedCount, processedTotal);
        statusCheckTimerRef.current = window.setTimeout(
          checkStatus,
          STATUS_CHECK_INTERVAL
        );
      } else if (
        wasProcessingRef.current &&
        processedCount === processedTotal &&
        processedCount > 0
      ) {
        toast({
          title: 'Success',
          description: `Completed processing all ${processedTotal} keywords`,
        });
        if (selectedItems?.length) {
          clearSelected?.();
        }
        wasProcessingRef.current = false;
        jobIdRef.current = null;
      }
    } catch (error) {
      console.error('Failed to check status:', error);
      toast({
        title: 'Error',
        description: 'Failed to check processing status. Will retry shortly.',
      });

      statusCheckTimerRef.current = window.setTimeout(
        checkStatus,
        STATUS_CHECK_INTERVAL * 2
      );
    }
  }, [selectedItems, toast, showProgressToast, clearSelected]);

  useEffect(() => {
    checkStatus();
    return () => {
      if (statusCheckTimerRef.current) {
        window.clearTimeout(statusCheckTimerRef.current);
      }
    };
  }, [checkStatus]);

  const handleGetMoreHistorical = useCallback(async () => {
    try {
      const response = await axiosClient.post(
        `/api/keywords/historical-more?action=start`,
        { items: selectedItems }
      );

      if (response?.data?.jobId) {
        jobIdRef.current = response.data.jobId;
        wasProcessingRef.current = true;
      }

      setIsHistoricalFetching(true);
      setProcessedPercent(0);
      lastToastRef.current = 0;

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
        jobId: jobIdRef.current,
      });

      toast({
        title: 'Processing Stopped',
        description: 'Processing will stop after the current chunk completes',
      });

      if (statusCheckTimerRef.current) {
        window.clearTimeout(statusCheckTimerRef.current);
        statusCheckTimerRef.current = null;
        wasProcessingRef.current = false;
      }

      if (selectedItems?.length) {
        clearSelected?.();
      }

      setTimeout(checkStatus, 1000);
    } catch (error) {
      console.error('Failed to stop processing:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop processing',
      });
    }
  }, [toast, selectedItems?.length, clearSelected, checkStatus]);

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant={'secondary'}
        className="bg-orange-200 text-blue-17 min-w-[220px] relative hover:bg-orange-100"
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
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            className="bg-red-300 hover:bg-red-300 hover:scale-100 hover:transition-all  text-red-900 min-w-[100px]"
            onClick={handleCancelHistorical}
          >
            Stop
          </Button>
        </div>
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
