import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type RemoveAlertingProps = {
  selectedRows?: Set<any>;
  keyword?: string;
  isDefaultKeywords: boolean;
  onConfirm: () => void;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  multipleKeyword?: boolean;
};

export default function RemoveAlerting({
  selectedRows,
  keyword,
  isDefaultKeywords,
  onConfirm,
  setIsOpen,
  isOpen,
  multipleKeyword = false,
}: RemoveAlertingProps) {
  const message = multipleKeyword
    ? `${selectedRows?.size || 0} selected keywords`
    : keyword;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {message}?
          </AlertDialogDescription>
          {isDefaultKeywords && (
            <AlertDialogDescription className="text-xs text-black-base">
              Since this is a default keyword, deleting it will also remove its
              historical data.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
