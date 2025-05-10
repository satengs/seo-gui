'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoogleGraphTable from '@/components/pages/GoogleGraph/GoogleGraphTable';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

export default function GoogleGraphPage() {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const { data: json } = await axios.get('/api/google-graph', {
          params: {
            page: currentPage,
            limit: pageSize
          }
        });
        if (json.error) {
          setError(json.error);
        } else {
          setData(json.data || []);
          setTotalPages(json.pagination.totalPages);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
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
        params: { fullList: true }
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
          console.error(`Failed to save for keyword ${keyword.term}:`, err);
          failCount++;
        }
      }
      toast({ title: 'Batch Save Complete', description: `Success: ${successCount}, Failed: ${failCount}` });
    } catch (error) {
      console.error('Error in batch save:', error);
      toast({ title: 'Error', description: 'Failed to save for all keywords', variant: 'destructive' });
    } finally {
      setIsChecking(false);
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
        disabled={isChecking}
      >
        {isChecking ? (
          <div className="flex items-center justify-center">
            <Spinner className="mr-2 h-4 w-4" />
            <span>Checking...</span>
          </div>
        ) : (
          'Knowledge Graph check'
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
    </div>
  );
}
