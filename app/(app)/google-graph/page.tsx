'use client';

import React, { useState, useEffect } from 'react';
import GoogleGraphTable from '@/components/pages/GoogleGraph/GoogleGraphTable';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

export default function GoogleGraphPage() {
  const [data, setData] = useState<any[]>([]);
  const [fullApiResponse, setFullApiResponse] = useState<any>(null);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    setFetchLoading(true);
    fetch('/api/google-graph/historical')
      .then(res => res.json())
      .then(res => {
        setData(res.data || []);
        setFetchLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch Google Graph historical data.');
        setFetchLoading(false);
      });
  }, []);


  const handleSaveAllKeywords = async () => {
    setIsChecking(true);
    try {
      const keywordsRes = await fetch('/api/keywords?fullList=true');
      const keywords = await keywordsRes.json();
      let successCount = 0;
      let failCount = 0;
      for (const keyword of keywords) {
        try {
          const graphRes = await fetch(`/api/keywords/knowledge-graph?query=${encodeURIComponent(keyword.term)}`);
          const graphData = await graphRes.json();
          console.log('graphData', graphData.entitiesData)
          await fetch('/api/keywords/save-google-graph', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              keywordId: keyword._id,
              term: keyword.term,
              data: graphData.entitiesData,
              timestamp: new Date().toISOString(),
            }),
          });
          successCount++;
        } catch (err) {
          failCount++;
          console.error(`Failed to save for keyword ${keyword.term}:`, err);
        }
      }
      toast({ title: 'Batch Save Complete', description: `Success: ${successCount}, Failed: ${failCount}` });
    } catch (error) {
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
        totalPages={Math.ceil(data.length / pageSize)}
        fetchLoading={fetchLoading}
        pageSize={pageSize}
        onPageChange={({ page }) => setCurrentPage(page || 1)}
      />
    </div>
  );
}
