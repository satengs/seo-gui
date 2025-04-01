import React from 'react';
import JsonViewer from '../JsonViewer';
import { IKeyword } from '@/types';

interface IKeywordItemSection {
  keyword: IKeyword;
}

const KeywordItemSection: React.FC<IKeywordItemSection> = ({ keyword }) => {
  return (
    <div className="col-span-1 overflow-auto bg-white rounded-lg shadow">
      <h3 className="p-4 text-xl font-semibold ">
        {keyword?.term || 'Keyword term'}
      </h3>

      <div className="p-4">
        <JsonViewer data={keyword} isExpanded={true} />
      </div>

      {keyword?.updatedAt ? (
        <div className="p-4 bg-gray-50 text-xs text-gray-500">
          Last updated: {new Date(keyword?.updatedAt).toLocaleString()}
        </div>
      ) : null}
    </div>
  );
};

export default KeywordItemSection;
