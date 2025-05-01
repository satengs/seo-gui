import React, { useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axiosClient from '@/lib/axiosClient';
import { useToast } from '@/hooks/use-toast';

function MoreHistoricalButton() {
  const { toast } = useToast();
  const [isHistoricalFetching, setIsHistoricalFetching] = useState(false);
  const [processedPercent, setProcessedPercent] = useState<number>(0);
  const [totalProcessed, setTotalProcessed] = useState<number>(0);

  const checkStatus = useCallback(async () => {
    try {
      const response = await axiosClient.get(
        '/api/keywords/historical-more?action=status'
      );
      setIsHistoricalFetching(response?.data?.isProcessing);

      if (response.data.isProcessing) {
        setTimeout(checkStatus, 5000);
      }

      setProcessedPercent(Math.round(response?.data?.processedPercent || 0));
      totalProcessed === 0 &&
        setTotalProcessed(Math.round(response?.data?.processedTotal || 0));
      if (totalProcessed !== 0) {
        toast({
          title: 'Progress',
          description: `Processed ${response?.data?.processedCount} of ${response?.data?.processedTotal} keywords (${Math.round(response?.data?.processedPercent)}%)`,
        });
      }
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  }, [totalProcessed]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleGetMoreHistorical = useCallback(async () => {
    try {
      await axiosClient.get('/api/keywords/historical-more?action=start');
      setIsHistoricalFetching(true);
      checkStatus();
    } catch (error) {
      console.error('Failed to start processing:', error);
    }
  }, [checkStatus]);

  const handleCancelHistorical = useCallback(async () => {
    try {
      await axiosClient.get('/api/keywords/historical-more?action=stop');
      setIsHistoricalFetching(false);
    } catch (error) {
      console.error('Failed to stop processing:', error);
    }
  }, []);

  return (
    <>
      <Button
        variant={'secondary'}
        className="bg-orange-200 text-blue-17 min-w-[200px] relative hover:bg-orange-100"
        onClick={handleGetMoreHistorical}
        disabled={isHistoricalFetching}
      >
        {isHistoricalFetching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Fetching... {processedPercent}%
          </>
        ) : (
          // <div
          //   className={
          //     'h-5 w-5 border-2 border-dashed border-blue-17 animate-spin rounded-full'
          //   }
          // />
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
    </>
  );
}

export default MoreHistoricalButton;
