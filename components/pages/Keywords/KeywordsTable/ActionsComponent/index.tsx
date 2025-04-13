import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DownloadIcon,
  Minus,
  Plus,
  SquareArrowOutUpRight,
  Trash,
  RefreshCcw,
} from 'lucide-react';
import MoreHistorical from './MoreHistorical';
import { IKeyword } from '@/types';
import axiosClient from '@/lib/axiosClient';
import { useToast } from '@/hooks/use-toast';
import { generateCsvFile } from '@/utils';
import RemoveAlerting from './RemoveAlerting/index';

interface IActionsComponent {
  keyword: any;
  currentPage: number;
  onActionKeywordsChange: (data: any, obj?: any) => void;
}

const ActionsComponent: React.FC<IActionsComponent> = ({
  keyword,
  currentPage,
  onActionKeywordsChange,
}) => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showHistorical, setShowHistorical] = useState<boolean>(false);
  const [removeModalLoading, setRemoveModalLoading] = useState<boolean>(false);
  const [keywordHistorical, setKeywordHistorical] = useState<any>({});

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

  const deleteKeyword = useCallback(async (keyword: IKeyword) => {
    try {
      setRemoveModalLoading(true);
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
    } finally {
      setRemoveModalLoading(false);
    }
  }, []);

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

  const handleMoreHistorical = useCallback(async (keyword: IKeyword) => {
    try {
      const response = await axiosClient.get(
        `/api/keywords/historical-more/${keyword._id}`
      );
      if (response.data) {
        setShowHistorical(true);
        setKeywordHistorical(response.data);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to fetch historical keyword',
        variant: 'destructive',
      });
    }
  }, []);

  const handleActionBtn = async (keyword: IKeyword, action: string) => {
    switch (action) {
      case 'new-tab': {
        const keywordPid = keyword?.term.toLowerCase().replace(/\s+/g, '-');
        window.open(
          `/keywords/${keywordPid}?location=${keyword?.location || 'United States'}&device=${keyword?.device || 'mobile'}`,
          '_blank'
        );
        break;
      }
      case 'remove-keyword': {
        onOpenModal();
        break;
      }
      case 'remove-from-default': {
        await changeKeyword(keyword);
        break;
      }
      case 'add-keyword': {
        await addKeyword(keyword);
        break;
      }
      case 'more-historical': {
        await handleMoreHistorical(keyword);
        break;
      }
      default:
        break;
    }
  };

  const downloadAsCSV = useCallback((keyword: IKeyword) => {
    generateCsvFile(keyword);
  }, []);

  const onCloseModal = useCallback(() => setShowModal(false), []);
  const onCloseModalHistorical = useCallback(
    () => setShowHistorical(false),
    []
  );
  const onOpenModal = useCallback(() => setShowModal(true), []);

  const onConfirmRemove = useCallback(async () => {
    await deleteKeyword(keyword);
    onCloseModal();
  }, [deleteKeyword, keyword, onCloseModal]);

  return (
    <>
      <section className={'col-span-1 m-1 flex items-center gap-2'}>
        {!keyword?.isDefaultKeywords ? (
          <div className={'relative group'}>
            <Button
              variant="secondary"
              className={
                'p-1 h-auto bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800 border-[0.5px]'
              }
              onClick={() => handleActionBtn(keyword, 'add-keyword')}
            >
              <>
                <Plus
                  className={`h-4 w-4 text-emerald-800 dark:text-emerald-200`}
                />
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
              className="p-1 h-auto border-[0.5px] bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800"
              onClick={() => handleActionBtn(keyword, 'remove-from-default')}
            >
              <Minus className="h-4 w-4 text-rose-800 dark:text-rose-200" />
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
              'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 border-[0.5px] h-auto p-1'
              // 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 border-[0.5px] h-auto p-1'
            }
            onClick={() => handleActionBtn(keyword, 'new-tab')}
          >
            <SquareArrowOutUpRight
              className={`h-4 w-4 text-blue-800 dark:text-blue-200`}
            />
          </Button>
          <span className="absolute top-full mt-2 bg-blue-50 text-blue-800  text-center  w-36  right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">
            Open Html results
          </span>
        </div>
        <div className={'relative group'}>
          <Button
            variant={'secondary'}
            className={
              'border-[0.5px] h-auto p-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800'
            }
            onClick={() => downloadAsCSV(keyword)}
          >
            <DownloadIcon
              className={`h-4 w-4 text-orange-800 dark:text-orange-200`}
            />
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
                'border-[0.5px] h-auto p-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
              }
              onClick={() => handleActionBtn(keyword, 'remove-keyword')}
            >
              <Trash className={`h-4 w-4 text-red-800 dark:text-red-200`} />
            </Button>
            <span className="absolute top-full mt-2 bg-red-50 text-red-800  text-center  w-36  right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">
              Remove from keywords
            </span>
          </div>
        ) : null}
        <div className={'relative group'}>
          <Button
            variant={'secondary'}
            className={
              'border-[0.5px] h-auto p-1 bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-200 border-lime-200 dark:border-lime-800'
            }
            onClick={() => handleActionBtn(keyword, 'more-historical')}
          >
            <RefreshCcw
              className={`h-4 w-4 ttext-lime-800 dark:text-lime-200`}
            />
          </Button>
          <span className="absolute top-full mt-2 bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-200 text-center w-36 right-0 text-sm px-3 py-2 rounded-md shadow-lg z-50 hidden group-hover:block">
            See more Historical
          </span>
        </div>
      </section>
      {showModal ? (
        <RemoveAlerting
          keyword={keyword?.term}
          isDefaultKeywords={keyword.isDefaultKeywords}
          setIsOpen={setShowModal}
          onConfirm={onConfirmRemove}
          isOpen={showModal}
          multipleKeyword={false}
        />
      ) : null}

      {showHistorical ? (
        <MoreHistorical
          onClose={onCloseModalHistorical}
          keywordHistorical={keywordHistorical}
          isOpen={showHistorical}
        />
      ) : null}
    </>
  );
};

export default ActionsComponent;
