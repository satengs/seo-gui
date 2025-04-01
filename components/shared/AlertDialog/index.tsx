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

interface IAlertDialogProps {
  open: boolean;
  cancelAction: () => void;
  submitAction: () => void;
  title: string;
  description?: string;
  cancelActionBtnText: string;
  submitActionBtnText: string;
}

const CustomAlertDialog = ({
  open,
  cancelAction,
  submitAction,
  title,
  description,
  cancelActionBtnText,
  submitActionBtnText,
}: IAlertDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || ''}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || ''}
            This action cannot be undone. This will permanently delete the user
            account and remove their data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => cancelAction()}>
            {cancelActionBtnText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={'bg-red-800'}
            onClick={() => submitAction()}
          >
            {submitActionBtnText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
