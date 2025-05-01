'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IKeywordPaginateParams } from '@/types';

interface PaginationProps {
  totalCount: number;
  onPageChange: (data: IKeywordPaginateParams) => void;
  onItemPerPageChange: (value: number) => void;
  itemsPerPage?: number;
  currentPage?: number;
  siblingCount?: number;
}

const PER_PAGE_OPTIONS = [10, 20, 30, 40];
const DOTS = '...';

function usePagination({
  totalCount,
  itemsPerPage = 30,
  siblingCount = 1,
  currentPage = 1,
}: {
  totalCount: number;
  itemsPerPage: number;
  siblingCount: number;
  currentPage: number;
}) {
  return useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / itemsPerPage);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    // If the number of pages is less than the page numbers we want to show
    if (totalPageNumbers >= totalPageCount) {
      return Array.from({ length: totalPageCount }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    // First case: show left dots but no right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPageCount];
    }

    // Second case: show right dots but no left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPageCount - rightItemCount + i + 1
      );
      return [1, DOTS, ...rightRange];
    }

    // Third case: show both left and right dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, DOTS, ...middleRange, DOTS, totalPageCount];
    }

    return [];
  }, [totalCount, itemsPerPage, siblingCount, currentPage]);
}

export default function Pagination({
  totalCount,
  onPageChange,
  onItemPerPageChange,
  itemsPerPage = 10,
  currentPage = 1,
  siblingCount = 1,
}: PaginationProps) {
  const paginationRange = usePagination({
    totalCount,
    itemsPerPage,
    siblingCount,
    currentPage,
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const start = totalPages === 0 ? '0' : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalCount);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange({ page: pageNumber });
    }
  };

  const handlePerPageChange = (value: string) => {
    onItemPerPageChange(+value);
  };

  return (
    <div className="my-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center space-x-1">
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-2 text-muted-foreground"
                >
                  {DOTS}
                </span>
              );
            }

            return (
              <Button
                key={pageNumber}
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(pageNumber as number)}
                className={cn(
                  currentPage === pageNumber &&
                    'bg-primary text-primary-foreground'
                )}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Show</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handlePerPageChange}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {start}-{end} of {totalCount} items
        </span>
        <span className="text-muted-foreground/50">•</span>
        <span>
          Page {totalPages === 0 ? '0' : currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
}
