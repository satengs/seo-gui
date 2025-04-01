import React from 'react';
import Modal from '@/components/shared/Modal';
import KeywordItemSection from '@/components/pages/Keywords/DifferenceModal/KeywordItemSection';
// import { Button } from '@/components/ui/button';

interface IMoreHistoricalProps {
  keywordHistorical: any;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

const MoreHistorical = ({
  keywordHistorical,
  isOpen,
  onClose,
}: IMoreHistoricalProps) => {
  // const onDownloadMoreHistorical = useCallback(() => {}, []);

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      customContainerClassName={`bg-white `}
    >
      <>
        {/*<div className={'flex items-center justify-end my-2'}>*/}
        {/*  <Button variant={'outline'} onClick={onDownloadMoreHistorical}>*/}
        {/*    Download*/}
        {/*  </Button>*/}
        {/*</div>*/}
        <div className={`grid grid-cols-1`}>
          {keywordHistorical
            ? [keywordHistorical].map((keyword: any) => (
                <KeywordItemSection key={`${keyword._id}`} keyword={keyword} />
              ))
            : null}
        </div>
      </>
    </Modal>
  );
};

export default React.memo(MoreHistorical);
