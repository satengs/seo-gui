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

type ConfirmDialogProps = {
  type?: string;
  selectedCount?: number;
  onActionHandle: (value: string) => void;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
};

export default function ConfirmDialog({
  setIsOpen,
  onActionHandle,
  type,
  selectedCount,
  isOpen,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          <AlertDialogDescription>
            Please select your option
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col items-center gap-4">
          <div className="flex gap-4  w-full items-center justify-between">
            <AlertDialogAction
              onClick={() => onActionHandle('selected')}
              className=" bg-foreground text-white w-1/2"
            >
              {type} for selected ({selectedCount})
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => onActionHandle('all')}
              className="bg-foreground w-1/2 text-white"
            >
              {type} for all
            </AlertDialogAction>
          </div>
          <AlertDialogCancel className="border border-foreground bg-white text-foreground w-full">
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
