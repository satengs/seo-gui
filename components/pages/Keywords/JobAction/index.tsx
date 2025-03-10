'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';

const JobAction: React.FC = () => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckKeywords = useCallback(async () => {
    try {
      setIsChecking(true);
      const response = await axiosClient.post('/api/keywords/check');
      toast({
        title: 'Success',
        description: `Checked ${response.data.results.length} keywords successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check keywords',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  }, [toast]);

  return (
    <Card className="py-3 my-3 flex items-center gap-4 border-0 shadow-none">
      <Button
        variant="secondary"
        className="bg-blue-300 text-blue-17 min-w-[150px]"
        onClick={handleCheckKeywords}
        disabled={isChecking}
      >
        {isChecking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
          </>
        ) : (
          'Check Keywords'
        )}
      </Button>
    </Card>
  );
};

export default JobAction;
