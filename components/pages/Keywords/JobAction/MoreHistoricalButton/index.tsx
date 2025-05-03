import React, { useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosClient from '@/lib/axiosClient';
import { useToast } from '@/hooks/use-toast';
export const STATUS_CHECK_INTERVAL = 5000;

const MoreHistoricalButton: React.FC = () => {
  const { toast } = useToast();
  const [isHistoricalFetching, setIsHistoricalFetching] = useState(false);
  const [processedPercent, setProcessedPercent] = useState<number>(0);
  const [totalProcessed, setTotalProcessed] = useState<number>(0);
  const [currentChunk, setCurrentChunk] = useState<number>(0);

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
      const response = await axiosClient.get(
        `/api/keywords/historical-more?action=status`
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
    } catch (error) {
      console.error('Failed to check status:', error);
      toast({
        title: 'Error',
        description: 'Failed to check processing status',
      });
    }
  }, [totalProcessed, updateToast, toast]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleGetMoreHistorical = useCallback(async () => {
    try {
      await axiosClient.get(`/api/keywords/historical-more?action=start`);
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
  }, [checkStatus, toast]);

  const handleCancelHistorical = useCallback(async () => {
    try {
      await axiosClient.get(`/api/keywords/historical-more?action=stop`);
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
    }
  }, [toast]);

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant={'secondary'}
        className="bg-orange-200 text-blue-17 min-w-[200px] relative hover:bg-orange-100"
        onClick={handleGetMoreHistorical}
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
        <button
          className="px-4 py-2 rounded-md bg-red-500 text-white"
          onClick={handleCancelHistorical}
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default MoreHistoricalButton;
