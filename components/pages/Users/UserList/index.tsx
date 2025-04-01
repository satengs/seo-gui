import React, { useCallback, useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import UserListEditableItem from '@/components/pages/Users/UserList/UserListEditableItem';
import UserListTableItem from '@/components/pages/Users/UserList/UserListTableItem';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { IUser } from '@/types';
import CustomAlertDialog from '@/components/shared/AlertDialog';

interface IUserList {
  users: IUser[] | null;
  onUserDelete: (item: IUser) => void;
  onUserEdit: (item: IUser) => void;
}

const UserList = ({ users, onUserDelete, onUserEdit }: IUserList) => {
  const { toast } = useToast();

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const toggleDeleteDialog = useCallback((item?: IUser) => {
    setShowDeleteDialog((prevState) => !prevState);
    if (item) {
      setCurrentUser(item);
    }
  }, []);
  const toggleEditDialog = useCallback((item?: IUser) => {
    if (item) {
      setCurrentUser(item);
    }
  }, []);

  const onDeleteUser = useCallback(async () => {
    if (currentUser?._id) {
      try {
        await axiosClient.delete(`/api/users/${currentUser?._id}`);
        onUserDelete(currentUser);
        toggleDeleteDialog();
      } catch (err) {
        toast({
          title: 'Failed',
          description: 'Failed to add user',
          variant: 'destructive',
        });
      }
    }
  }, [currentUser, onUserDelete, toast, toggleDeleteDialog]);

  return (
    <>
      <div className={'my-6'}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Full Name</TableHead>
                <TableHead className="w-[200px]">Email</TableHead>
                <TableHead className="w-[200px]">Password</TableHead>
                <TableHead className="w-[200px]"> Role</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.length
                ? users.map((user) => (
                    <React.Fragment key={user?._id}>
                      {currentUser?._id !== user?._id ? (
                        <UserListTableItem
                          item={user}
                          toggleEditBtn={toggleEditDialog}
                          toggleDeleteBtn={toggleDeleteDialog}
                        />
                      ) : (
                        <UserListEditableItem
                          item={user}
                          onCancelEditing={toggleEditDialog}
                          onUserEdit={onUserEdit}
                        />
                      )}
                    </React.Fragment>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </div>
      {showDeleteDialog ? (
        <CustomAlertDialog
          open={showDeleteDialog}
          cancelAction={toggleDeleteDialog}
          submitAction={onDeleteUser}
          title={'Are you sure?'}
          cancelActionBtnText={'Cancel'}
          submitActionBtnText={'Delete'}
        />
      ) : null}
    </>
  );
};

export default React.memo(UserList);
