'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import GoogleGraphTable from '@/components/pages/GoogleGraph/GoogleGraphTable';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import UpdateConfirmationDialog from '@/components/pages/GoogleGraph/UpdateConfirmationDialog';
import axiosClient from '@/lib/axiosClient/index';

export default function GoogleGraphPage() {
  const [data, setData] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'createdAt',
    direction: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSearchTerm, setActiveSearchTerm] = useState<string>('');
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const fetchKeywords = useCallback(async () => {
    try {
      const resp = await axios.get('/api/google-graph/keywords');
      if (!resp.data || !Array.isArray(resp.data)) {
        console.error('Invalid response format:', resp.data);
        toast({
          title: 'Error',
          description: 'Invalid response format from keywords API',
          variant: 'destructive',
        });
        return;
      }

      setKeywords(resp.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
      toast({
        title: 'Error',
        description: 'Failed to fetch keywords. Please refresh the page.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  const fetchData = useCallback(
    async (page: number = 1, size: number = pageSize) => {
      setFetchLoading(true);
      setError(null);
      try {
        const params: any = {
          page,
          limit: size,
          sortBy: sortConfig.key,
          sortDirection: sortConfig.direction,
        };

        if (activeSearchTerm) {
          params.searchTerm = activeSearchTerm;
        }

        const { data: json } = await axios.get('/api/google-graph', { params });

        if (json.error) {
          setError(json.error);
          setData([]);
          setTotalPages(0);
          setTotalCount(0);
        } else {
          setData(json.data || []);
          setTotalPages(json.pagination?.totalPages || 0);
          setTotalCount(json.pagination?.total || 0);
        }
      } catch (err) {
        setError('Failed to fetch Google Graph data.');
        setData([]);
        setTotalPages(0);
        setTotalCount(0);
      } finally {
        setFetchLoading(false);
      }
    },
    [pageSize, sortConfig, activeSearchTerm]
  );

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    setActiveSearchTerm(searchTerm.trim());
  }, [searchTerm]);

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [activeSearchTerm, currentPage, pageSize, sortConfig, fetchData]);

  const handlePageChange = useCallback(({ page }: { page?: number }) => {
    if (page) {
      setCurrentPage(page);
    }
  }, []);

  const handleItemPerPageChange = useCallback((value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  }, []);

  const handleStopProcessing = useCallback(() => {
    if (abortController) {
      abortController.abort();
    }
    setIsCancelled(true);
    setIsUpdating(false);
    setProgress(0);
    setAbortController(null);
    toast({
      title: 'Stopping',
      description: 'Stopping Google Graph data processing...',
    });
  }, [toast, abortController]);

  const processNextChunk = async (keywords: any[], startIndex: number) => {
    try {
      if (isCancelled) {
        setIsUpdating(false);
        setProgress(0);
        toast({
          title: 'Cancelled',
          description: 'Google Graph data processing was cancelled',
        });
        return;
      }

      const controller = new AbortController();
      setAbortController(controller);

      const chunk = keywords.slice(startIndex, startIndex + 10);
      const results = [];

      for (const keyword of chunk) {
        if (isCancelled) {
          controller.abort();
          setIsUpdating(false);
          setProgress(0);
          toast({
            title: 'Cancelled',
            description: 'Google Graph data processing was cancelled',
          });
          return;
        }

        try {
          const result = await axios.post(
            '/api/google-graph',
            {
              keywordId: keyword._id,
              term: keyword.term,
              timestamp: new Date(),
              update: true,
            },
            {
              signal: controller.signal,
            }
          );
          results.push(result.data);
        } catch (error) {
          if (axios.isCancel(error)) {
            return;
          }
          results.push({
            keyword: keyword.term,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to process keyword',
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const processedKeywords = startIndex + chunk.length;
      const progressPercentage = Math.round(
        (processedKeywords / keywords.length) * 100
      );
      setProgress(progressPercentage);

      if (processedKeywords < keywords.length && !isCancelled) {
        await processNextChunk(keywords, processedKeywords);
      } else {
        setIsUpdating(false);
        setProgress(100);
        toast({
          title: 'Success',
          description: `Successfully updated ${processedKeywords} keywords`,
        });
        await fetchData(currentPage, pageSize);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }
      setIsUpdating(false);
      setProgress(0);
      toast({
        title: 'Error',
        description: 'Failed to process keywords. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateDailyData = async () => {
    try {
      setIsChecking(true);
      const hasData = await checkExistingData();

      if (hasData) {
        setShowConfirmModal(true);
        toast({
          title: 'Data Found',
          description: 'Existing data found for today. Please confirm to update.',
        });
      } else {
        setIsChecking(false);
        setIsUpdating(true);
        setProgress(0);
        setIsCancelled(false);
        await processNextChunk(keywords, 0);
      }
    } catch (error) {
      setError('Failed to check existing data');
      setIsChecking(false);
      setProgress(0);
      toast({
        title: 'Error',
        description: 'Failed to check existing data',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmModal(false);
    setIsChecking(false);
    setIsUpdating(true);
    setProgress(0);
    setIsCancelled(false);
    await processNextChunk(keywords, 0);
  };

  const checkExistingData = async () => {
    try {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );

      const response = await axiosClient.get('/api/google-graph', {
        params: {
          page: 1,
          limit: 1,
          startDate: startOfDay.toISOString(),
          endDate: endOfDay.toISOString(),
        },
      });

      const hasData = response.data.data && response.data.data.length > 0;
      setHasExistingData(hasData);
      return hasData;
    } catch (error) {
      return false;
    }
  };

  const handleSort = useCallback(
    (key: string) => {
      let direction = 'asc';
      setSortConfig((prev) => {
        direction =
          prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc';
        return {
          key,
          direction:
            prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        };
      });
      setFetchLoading(true);
      fetchData(currentPage, pageSize);
    },
    [currentPage, pageSize, fetchData]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpdateDailyData}
            disabled={isUpdating || isChecking}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] relative"
          >
            {isChecking ? (
              <div className="flex items-center justify-center">
                <Spinner className="mr-2 h-4 w-4" />
                <span>Checking Data... {progress}%</span>
              </div>
            ) : isUpdating ? (
              <div className="flex items-center justify-center">
                <Spinner className="mr-2 h-4 w-4" />
                <span>Updating Data... {progress}%</span>
              </div>
            ) : (
              'Update Daily Data'
            )}
            {(isUpdating || isChecking) && progress > 0 && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            )}
          </Button>
          {isUpdating && (
            <Button
              variant="outline"
              className="bg-red-300 text-red-900 min-w-[100px]"
              onClick={handleStopProcessing}
              disabled={isCancelled}
            >
              Stop
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <GoogleGraphTable
        data={data}
        currentPage={currentPage}
        totalCount={totalCount}
        totalPages={totalPages}
        fetchLoading={fetchLoading}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onItemPerPageChange={handleItemPerPageChange}
        onSort={handleSort}
        sortConfig={sortConfig}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
      />

      <UpdateConfirmationDialog
        onConfirm={handleConfirmUpdate}
        onOpenChange={(open) => {
          setShowConfirmModal(open);
          if (!open) {
            setIsChecking(false);
            setProgress(0);
          }
        }}
        open={showConfirmModal}
      />
    </div>
  );
}
