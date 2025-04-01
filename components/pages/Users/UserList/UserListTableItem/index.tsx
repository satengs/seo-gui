import React from 'react';
import { IUser } from '@/types';
import { TableCell, TableRow } from '@/components/ui/table';
import CustomButton from '@/components/shared/CustomButton';
import { Edit, Trash2 } from 'lucide-react';
import { capitalizeFirstLetter } from '@/lib/utils';

interface IUserListItemProps {
  item: IUser;
  toggleEditBtn: (item: IUser) => void;
  toggleDeleteBtn: (item: IUser) => void;
}

const UserListTableItem = ({
  item,
  toggleDeleteBtn,
  toggleEditBtn,
}: IUserListItemProps) => {
  return (
    <TableRow>
      <TableCell className="w-[200px]">{item.fullName}</TableCell>
      <TableCell className="w-[200px]">{item.email}</TableCell>
      <TableCell className="w-[200px] text-xl font-bold">
        {'.'.repeat(14)}
      </TableCell>
      <TableCell className="w-[200px]">
        {capitalizeFirstLetter(item.roleId?.name)}
      </TableCell>
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

export default UserListTableItem;
