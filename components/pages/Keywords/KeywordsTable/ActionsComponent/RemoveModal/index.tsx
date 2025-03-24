import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Modal from '@/components/shared/Modal';
import { useToast } from '@/hooks/use-toast';

interface IRemoveModalBodyProps {
  keyword: string;
  isDefaultKeywords: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const RemoveModal = ({
  keyword,
  isDefaultKeywords,
  onCancel,
  onConfirm,
  isOpen,
  loading,
}: IRemoveModalBodyProps) => {
  return (
    <Modal
      onClose={onCancel}
      isOpen={isOpen}
      customContainerClassName={`bg-white w-full max-w-[425px] ${isDefaultKeywords ? 'h-[22%]' : 'h-[18%]'} overflow-hidden rounded-md px-4`}
      childrenContainerClassName={'px-3 my-2 flex items-cennter'}
    >
      <div className={'flex flex-col gap-3'}>
        <p className={'text-md  leading-6'}>
          Are you sure you want to delete{' '}
          <span className={`font-semibold text-base text-red-700`}>
            {keyword}
          </span>{' '}
          keyword?
        </p>
        {isDefaultKeywords ? (
          <span className={'text-gray-500 text-xs '}>
            Since this is a default keyword, deleting it will also remove its
            historical data.
          </span>
        ) : null}
        <div className={'flex items-center my-2 justify-end gap-4'}>
          <Button variant={'outline'} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={'default'}
            className={'bg-red-700 hover:bg-red-600'}
            onClick={onConfirm}
          >
            {loading ? (
              <span
                className={
                  'h-5 w-5 border-2 border-dashed border-white animate-spin rounded-full'
                }
              ></span>
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(RemoveModal);
