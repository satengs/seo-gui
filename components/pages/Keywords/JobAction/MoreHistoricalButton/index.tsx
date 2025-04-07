import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';

function MoreHistoricalButton() {
  const [isHistoricalFetching, setIsHistoricalFetching] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/keywords/get-more?action=status');
      const data = await response.json();
      setIsHistoricalFetching(data.isProcessing);

      if (data.isProcessing) {
        setTimeout(checkStatus, 5000);
      }
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleGetMoreHistorical = useCallback(async () => {
    try {
      await fetch('/api/keywords/get-more?action=start');
      setIsHistoricalFetching(true);
      checkStatus();
    } catch (error) {
      console.error('Failed to start processing:', error);
    }
  }, [checkStatus]);

  const handleCancelHistorical = useCallback(async () => {
    try {
      await fetch('/api/keywords/get-more?action=stop');
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
          <div
            className={
              'h-5 w-5 border-2 border-dashed border-blue-17 animate-spin rounded-full'
            }
          />
        ) : (
          'Get more historical'
        )}
      </Button>
      {isHistoricalFetching && (
        <button
          className="px-4 py-2 rounded-md bg-red-500 text-white"
          onClick={handleCancelHistorical}
        >
          Cancel
        </button>
      )}
    </>
  );
}

export default MoreHistoricalButton;
