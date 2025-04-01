import React, { useCallback, useState } from 'react';
import { IOrganization } from '@/types';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import OrganizationListTableItem from '@/components/pages/Organizations/OrganizationsList/OrganizationListTableItem';
import OrganizationListEditableItem from '@/components/pages/Organizations/OrganizationsList/OrganizationListTableEditableItem';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import CustomAlertDialog from '@/components/shared/AlertDialog';

interface IOrganizationListProps {
  organizations: IOrganization[] | null;
  onOrganizationDelete: (item: IOrganization) => void;
  onOrganizationEdit: (item: IOrganization) => void;
}

const UserList = ({
  organizations,
  onOrganizationDelete,
  onOrganizationEdit,
}: IOrganizationListProps) => {
  const { toast } = useToast();

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [currentOrganization, setCurrentOrganization] =
    useState<IOrganization | null>(null);

  const toggleDeleteDialog = useCallback((item?: IOrganization) => {
    setShowDeleteDialog((prevState) => !prevState);
    if (item) {
      setCurrentOrganization(item);
    }
  }, []);
  const toggleEditDialog = useCallback((item?: IOrganization) => {
    setShowEditDialog((prevState) => !prevState);
    if (item) {
      setCurrentOrganization(item);
    }
  }, []);

  const onDeleteOrganization = useCallback(async () => {
    if (currentOrganization?._id) {
      try {
        await axiosClient.delete(
          `/api/organizations/${currentOrganization?._id}`
        );
        onOrganizationDelete(currentOrganization);
        toggleDeleteDialog();
      } catch (err) {
        toast({
          title: 'Failed',
          description: 'Failed to delete organization',
          variant: 'destructive',
        });
      }
    }
  }, [currentOrganization, onOrganizationDelete, toast, toggleDeleteDialog]);

  return (
    <>
      <div className={'my-6'}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]"> Name</TableHead>
                <TableHead className="w-[50px]"> Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations?.length
                ? organizations.map((organization) => (
                    <React.Fragment key={organization?._id}>
                      {currentOrganization?._id !== organization?._id ? (
                        <OrganizationListTableItem
                          item={organization}
                          toggleEditBtn={toggleEditDialog}
                          toggleDeleteBtn={toggleDeleteDialog}
                        />
                      ) : (
                        <OrganizationListEditableItem
                          item={organization}
                          onCancelEditing={toggleEditDialog}
                          onOrganizationEdit={onOrganizationEdit}
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
          submitAction={onDeleteOrganization}
          title={'Are you sure?'}
          cancelActionBtnText={'Cancel'}
          submitActionBtnText={'Delete'}
        />
      ) : null}
    </>
  );
};

export default React.memo(UserList);
