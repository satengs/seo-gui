import React from 'react';
import Modal from '@/components/shared/Modal';
import JsonViewer from '@/components/pages/Keywords/DifferenceModal/JsonViewer';

interface DataViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRowsData: any[];
  historicalData: Record<string, any[]>;
}

const DataViewModal: React.FC<DataViewModalProps> = ({
  isOpen,
  onClose,
  selectedRowsData,
  historicalData,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      customContainerClassName="bg-white rounded-md"
    >
      <div className="grid grid-cols-2">
        {selectedRowsData.map((row) => {
          const displayData = {
            _id: row._id,
            keywordId: row.keywordId,
            term: row.term,
            historicalData: historicalData[row._id]?.reduce(
              (acc, item) => {
                acc[new Date(item.createdAt).toLocaleDateString()] = item.data;
                return acc;
              },
              {}
            ),
            createdAt: new Date(row.createdAt).toLocaleString(),
          };

          return (
            <div
              key={row._id}
              className="col-span-1 overflow-auto bg-white rounded-lg shadow"
            >
              <h3 className="p-4 text-xl font-semibold">
                {row.term || 'Keyword term'}
              </h3>
              <div className="p-4">
                <JsonViewer data={displayData} isExpanded={true} />
              </div>
              {row.createdAt && (
                <div className="p-4 bg-gray-50 text-xs text-gray-500">
                  Last updated: {new Date(row.createdAt).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default DataViewModal; 