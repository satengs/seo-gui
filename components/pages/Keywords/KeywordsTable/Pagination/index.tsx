import React, {useMemo, useState} from 'react';
import {Button} from '@/components/ui/button';

interface IPaginationProps {
  totalCount: number;
  onPageChange: (value: number) => void;
}

const Pagination: React.FC<IPaginationProps> = ({
  totalCount,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const onBtnHandler = (value: number) => {
    setCurrentPage(value);
    if (onPageChange && typeof onPageChange) {
      onPageChange(value);
    }
  };

  const totalPages = useMemo(() => Math.ceil(totalCount / 10), [totalCount]);

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBtnHandler(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBtnHandler(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default React.memo(Pagination);
