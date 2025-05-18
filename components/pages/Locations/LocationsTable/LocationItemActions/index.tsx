import React, { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import RemoveAlerting from '@/components/pages/Keywords/KeywordsTable/ActionsComponent/RemoveAlerting';
import axiosClient from '@/lib/axiosClient';
import { ILocation } from '@/types';

interface IActionsComponent {
  location: any;
  currentPage: number;
  onLocationChange: (data: any, obj?: any) => void;
}

const LocationItemActions: React.FC<IActionsComponent> = ({
  location,
  currentPage,
  onLocationChange,
}) => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [removeModalLoading, setRemoveModalLoading] = useState<boolean>(false);

  const deleteLocation = useCallback(
    async (location: ILocation) => {
      try {
        setRemoveModalLoading(true);
        const response = await axiosClient.delete(
          `/api/locations?location=${location._id}&page=${currentPage || 1}`
        );
        onLocationChange(response?.data || []);
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to remove keyword',
          variant: 'destructive',
        });
      } finally {
        setRemoveModalLoading(false);
      }
    },
    [currentPage, onLocationChange, toast]
  );

  const onCloseModal = useCallback(() => setShowModal(false), []);

  const onOpenModal = useCallback(() => setShowModal(true), []);

  const onConfirmRemove = useCallback(async () => {
    await deleteLocation(location);
    onCloseModal();
  }, [deleteLocation, location, onCloseModal]);

  return (
    <>
      <section className={'col-span-1 m-1 flex items-center gap-2'}>
        {location?.['_id'] ? (
          <div className={'relative group'}>
            <Button
              variant={'secondary'}
              className={
                'border-[0.5px] h-auto p-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
              }
              onClick={onOpenModal}
            >
              <Trash className={`h-4 w-4 text-red-800 dark:text-red-200`} />
            </Button>
          </div>
        ) : null}
      </section>
      {showModal ? (
        <RemoveAlerting
          keyword={location?.location}
          isDefaultKeywords={false}
          setIsOpen={setShowModal}
          onConfirm={onConfirmRemove}
          isOpen={showModal}
          multipleKeyword={false}
        />
      ) : null}
    </>
  );
};

export default LocationItemActions;
