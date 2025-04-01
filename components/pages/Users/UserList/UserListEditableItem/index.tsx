import React, { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TableCell, TableRow } from '@/components/ui/table';
import CustomInput from '@/components/shared/CustomInput';
import CustomSelect from '@/components/shared/CustomSelect';
import CustomButton from '@/components/shared/CustomButton';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';
import { capitalizeFirstLetter } from '@/lib/utils';
import { signUpValidationSchema } from '@/components/pages/Auth/SignUp/signUpValidationSchema';
import { IUser, IUserTableItem } from '@/types';
import { useAuthContext } from '@/context/AuthContext';
import { userAddValidationSchema } from '@/components/pages/Users/UsersActionForm/userAddValidationSchema';

interface IUserListEditableItemProps {
  item: IUser;
  onCancelEditing: () => void;
  onUserEdit: (item: IUser) => void;
}

const UserListEditableItem = ({
  item,
  onCancelEditing,
  onUserEdit,
}: IUserListEditableItemProps) => {
  const { roles } = useAuthContext();
  const { toast } = useToast();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, defaultValues },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: '',
    },
    resolver: yupResolver(userAddValidationSchema),
  });

  const roleOptions = useMemo(() => {
    if (roles?.length) {
      return roles.map((role) => ({
        value: role._id,
        label: capitalizeFirstLetter(role.name),
      }));
    }
    return [];
  }, [roles]);

  useEffect(() => {
    if (item && defaultValues) {
      const keys = Object.keys(defaultValues);
      keys.forEach((key) => {
        console.log('key: ', key);
        console.log('lll: ', item?.roleId._id);
        if (key === 'role') {
          setValue('role', item.roleId._id);
        } else {
          // @ts-ignore
          setValue(key as keyof IUserTableItem, item[key]);
        }
      });
    }
  }, [defaultValues, item, setValue]);

  const onSaveChanges = useCallback(
    async (data: IUserTableItem) => {
      if (item?._id) {
        try {
          console.log('data: ', data);
          const resp = await axiosClient.patch(`/api/users/${item._id}`, data);
          onUserEdit(resp.data);
          onCancelEditing();
        } catch (err) {
          toast({
            title: 'Failed',
            description: 'Failed to update user.',
            variant: 'destructive',
          });
        }
      }
    },
    [item._id, onUserEdit, toast]
  );

  return (
    <TableRow>
      <TableCell className="w-[200px]">
        <CustomInput
          name={'fullName'}
          control={control}
          error={errors.fullName?.message}
          className="max-w-full"
          inputClassName={'border-none shadow-none'}
        />
      </TableCell>
      <TableCell className="w-[200px]">
        <CustomInput
          name={'email'}
          control={control}
          error={errors.email?.message}
          className="max-w-full"
          inputClassName={'border-none shadow-none'}
        />
      </TableCell>
      <TableCell className="w-[200px]">
        <CustomInput
          name={'password'}
          type={'password'}
          disabled={true}
          eye={true}
          control={control}
          error={errors.password?.message}
          className="max-w-full "
          inputClassName={'border-none shadow-none'}
        />
      </TableCell>
      <TableCell className="w-[200px]">
        <CustomSelect
          options={roleOptions}
          control={control}
          name={'role'}
          disabled={true}
          error={errors.role?.message}
          className={'pb-0'}
        />
      </TableCell>
      <TableCell className="w-[50px]">
        <div className="flex space-x-2">
          <CustomButton variant="text" onClick={handleSubmit(onSaveChanges)}>
            <Check className="h-4 w-4 text-green-600" />
          </CustomButton>
          <CustomButton variant="text" onClick={onCancelEditing}>
            <X className="h-4 w-4 text-red-600" />
          </CustomButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserListEditableItem;
