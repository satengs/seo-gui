import React from 'react';
import { IKeyword } from '@/types';
import KeywordItemSection from '@/components/pages/Keywords/DifferenceModal/KeywordItemSection';

interface IDifferenceModal {
  keywords: IKeyword[] | [];
}

const DifferenceModal: React.FC<IDifferenceModal> = ({ keywords }) => {
  return (
    <div className={`grid grid-cols-2`}>
      {keywords?.length
        ? keywords.map((keyword) => (
            <KeywordItemSection key={`${keyword._id}`} keyword={keyword} />
          ))
        : null}
    </div>
  );
};

export default DifferenceModal;
