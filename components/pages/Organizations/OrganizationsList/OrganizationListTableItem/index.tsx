import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import CustomButton from '@/components/shared/CustomButton';
import { IOrganization } from '@/types';

interface IOrganizationListItemProps {
  item: IOrganization;
  toggleEditBtn: (item: IOrganization) => void;
  toggleDeleteBtn: (item: IOrganization) => void;
}

const OrganizationListTableItem = ({
  item,
  toggleDeleteBtn,
  toggleEditBtn,
}: IOrganizationListItemProps) => {
  return (
    <TableRow>
      <TableCell className="w-[200px]">{item.name}</TableCell>
      <TableCell className="w-[200px]">{item.admin?.fullName}</TableCell>
      <TableCell className="w-[50px]">
        <div className="flex space-x-2">
          <CustomButton variant="text" onClick={() => toggleEditBtn(item)}>
            <Edit className="h-4 w-4" />
          </CustomButton>
          <CustomButton variant="text" onClick={() => toggleDeleteBtn(item)}>
            <Trash2 className="h-4 w-4" />
          </CustomButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default OrganizationListTableItem;
