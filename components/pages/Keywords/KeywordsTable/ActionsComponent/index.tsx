import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  DownloadIcon,
  Minus,
  Plus,
  SquareArrowOutUpRight,
  Trash,
} from 'lucide-react';
import { IKeyword } from '@/types';
import axiosClient from '@/lib/axiosClient';
import { useToast } from '@/hooks/use-toast';
import { generateCSV } from '@/lib/utils';

interface IActionsComponent {
  keyword: any;
  currentPage: number;
  onActionKeywordsChange: (data: any) => void;
}

const ActionsComponent: React.FC<IActionsComponent> = ({
  keyword,
  currentPage,
  onActionKeywordsChange,
}) => {
  const { toast } = useToast();

  const changeKeyword = async (keyword: IKeyword) => {
    try {
      const patchData = {
        term: keyword.term,
        keywordData: keyword,
        updatedData: {
          isDefaultKeywords: false,
        },
      };
      const response = await axiosClient.patch(
        `/api/keywords?page=${currentPage || 1}`,
        patchData
      );
      onActionKeywordsChange(response?.data || []);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to remove keyword from defaults',
        variant: 'destructive',
      });
    }
  };

  const deleteKeyword = async (keyword: IKeyword) => {
    try {
      const response = await axiosClient.delete(
        `/api/keywords?keyword=${keyword._id}&page=${currentPage || 1}`
      );
      onActionKeywordsChange(response?.data || []);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to remove keyword',
        variant: 'destructive',
      });
    }
  };

  const addKeyword = async (keyword: IKeyword) => {
    try {
      const response = await axiosClient.post(
        `/api/keywords?page=${currentPage || 1}`,
        keyword
      );
      onActionKeywordsChange(response?.data || []);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add keyword',
        variant: 'destructive',
      });
    }
  };

  const handleActionBtn = async (keyword: IKeyword, action: string) => {
    if (action === 'new-tab') {
      const keywordPid = keyword?.term.toLowerCase().replace(/\s+/g, '-');
      window.open(
        `/keywords/${keywordPid}?location=${keyword?.location || 'United States'}&device=${keyword?.device || 'mobile'}`,
        '_blank'
      );
    }
    if (action === 'remove-keyword') {
      await deleteKeyword(keyword);
    }
    if (action === 'remove-from-default') {
      await changeKeyword(keyword);
    }
    if (action === 'add-keyword') {
      await addKeyword(keyword);
    }
  };

  const downloadAsCSV = useCallback((keyword: any) => {
    const csvContent = generateCSV(keyword);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  return (
    <section className={'col-span-1 m-1 flex items-center gap-4'}>
      {!keyword?.isDefaultKeywords ? (
        <div className={'relative group'}>
          <Button
            variant="secondary"
            className={
              'text-green-800 p-1 h-auto border bg-white border-green-800'
            }
            onClick={() => handleActionBtn(keyword, 'add-keyword')}
          >
            <>
              <Plus className={`h-4 w-4 text-green-800`} />
              <span className="absolute top-full mt-2 bg-green-50 text-center  w-48 right-0 text-green-800 text-sm px-3 py-1 rounded-md shadow-lg z-50 hidden group-hover:block">
                Add to default keywords
              </span>
            </>
          </Button>
        </div>
      ) : (
        <div className="relative group">
          <Button
            variant="secondary"
            className="text-red-800 p-1 h-auto bg-white border-[0.5px] border-red-800"
            onClick={() => handleActionBtn(keyword, 'remove-from-default')}
          >
            <Minus className="h-4 w-4 text-red-800" />
          </Button>

          <span className="absolute top-full mt-2 bg-red-50 text-center  w-36 right-0 text-red-800 text-sm px-3 py-1 rounded-md shadow-lg z-50 hidden group-hover:block">
            Remove from default keywords
          </span>
        </div>
      )}
      <div className={'relative group'}>
        <Button
          variant={'secondary'}
          className={
            'text-blue-800 border-[0.5px] bg-white border-blue-800 h-auto p-1'
          }
          onClick={() => handleActionBtn(keyword, 'new-tab')}
        >
          <SquareArrowOutUpRight className={`h-4 w-4 text-blue-800`} />
        </Button>
        <span className="absolute top-full mt-2 bg-blue-50 text-blue-800  text-center  w-36  right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">
          Open Html results
        </span>
      </div>
      <div className={'relative group'}>
        <Button
          variant={'secondary'}
          className={
            'text-orange-800-800 border-[0.5px] bg-white border-yellow-500 h-auto p-1'
          }
          onClick={() => downloadAsCSV(keyword)}
        >
          <DownloadIcon className={`h-4 w-4 text-yellow-500`} />
        </Button>
        <span className="absolute top-full mt-2 bg-yellow-50 text-yellow-500 text-center w-36 right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">
          Download csv
        </span>
      </div>
      {keyword?.['_id'] ? (
        <div className={'relative group'}>
          <Button
            variant={'secondary'}
            className={
              'text-blue-800 bg-white border-[0.5px] border-red-800 h-auto p-1'
            }
            onClick={() => handleActionBtn(keyword, 'remove-keyword')}
          >
            <Trash className={`h-4 w-4 text-red-800`} />
          </Button>
          <span className="absolute top-full mt-2 bg-red-50 text-red-800  text-center  w-36  right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">
            Remove from keywords
          </span>
        </div>
      ) : null}
    </section>
  );
};

export default ActionsComponent;
