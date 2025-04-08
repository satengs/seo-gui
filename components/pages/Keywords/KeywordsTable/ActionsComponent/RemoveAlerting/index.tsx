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

export default function RemoveAlerting({
  selectedRows,
  keyword,
  isDefaultKeywords,
  onConfirm,
  setIsOpen,
  isOpen,
  multipleKeyword,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            {`Are you sure you want to delete ${
              multipleKeyword
                ? `${selectedRows.size} selected keywords`
                : keyword
            }?`}
          </AlertDialogDescription>
          {isDefaultKeywords ? (
            <AlertDialogDescription className="text-xs text-black-base">
              Since this is a default keyword, deleting it will also remove its
              historical data.
            </AlertDialogDescription>
          ) : (
            <></>
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
