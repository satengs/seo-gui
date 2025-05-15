'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoogleGraphTable from '@/components/pages/GoogleGraph/GoogleGraphTable';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import UpdateConfirmationDialog from '@/components/pages/GoogleGraph/UpdateConfirmationDialog';

export default function GoogleGraphPage() {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const { data: json } = await axios.get('/api/google-graph', {
          params: {
            page: currentPage,
            limit: pageSize,
          },
        });
        if (json.error) {
          setError(json.error);
        } else {
          setData(json.data || []);
          setTotalPages(json.pagination.totalPages);
        }
      } catch (err) {
        setError('Failed to fetch Google Graph data.');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  const handleSaveAllKeywords = async () => {
    setIsChecking(true);
    try {
      const { data: keywords } = await axios.get('/api/keywords', {
        params: { fullList: true },
      });

      // Check if any keyword has data for today
      const today = new Date().toISOString().split('T')[0];
      let hasExistingData = false;

      for (const keyword of keywords) {
        const { data: existingData } = await axios.get('/api/google-graph', {
          params: {
            keywordId: keyword._id,
            limit: 1,
          },
        });

        if (existingData?.data?.[0]) {
          const existingDate = new Date(existingData.data[0].createdAt)
            .toISOString()
            .split('T')[0];
          if (existingDate === today) {
            hasExistingData = true;
            break;
          }
        }
      }

      if (hasExistingData) {
        setShowConfirmModal(true);
        setIsChecking(false);
        return;
      }

      await handleConfirmUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check existing data',
        variant: 'destructive',
      });
      setIsChecking(false);
    }
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmModal(false);
    setIsUpdating(true);
    try {
      const { data: keywords } = await axios.get('/api/keywords', {
        params: { fullList: true },
      });
      let successCount = 0;
      let failCount = 0;
      for (const keyword of keywords) {
        try {
          await axios.post('/api/google-graph', {
            keywordId: keyword._id,
            term: keyword.term,
            timestamp: new Date().toISOString(),
          });
          successCount++;
        } catch (err) {
          failCount++;
        }
      }
      toast({
        title: 'Batch Save Complete',
        description: `Success: ${successCount}, Failed: ${failCount}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save for all keywords',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handleSaveAllKeywords}
        variant="outline"
        className={'bg-blue-300 text-blue-17 min-w-[200px] relative ml-1'}
        disabled={isChecking || isUpdating}
      >
        {isChecking ? (
          <div className="flex items-center justify-center">
            <Spinner className="mr-2 h-4 w-4" />
            <span>Checking Data...</span>
          </div>
        ) : isUpdating ? (
          <div className="flex items-center justify-center">
            <Spinner className="mr-2 h-4 w-4" />
            <span>Updating Data...</span>
          </div>
        ) : (
          'Update Daily Data'
        )}
      </Button>
      <GoogleGraphTable
        data={data}
        currentPage={currentPage}
        totalCount={data.length}
        totalPages={totalPages}
        fetchLoading={fetchLoading}
        pageSize={pageSize}
        onPageChange={({ page }) => setCurrentPage(page || 1)}
      />

      {showConfirmModal && (
        <UpdateConfirmationDialog
          onConfirm={handleConfirmUpdate}
          onOpenChange={setShowConfirmModal}
          open={showConfirmModal}
        />
      )}
    </div>
  );
}
