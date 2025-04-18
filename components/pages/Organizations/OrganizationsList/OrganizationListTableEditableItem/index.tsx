import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TableCell, TableRow } from '@/components/ui/table';
import CustomInput from '@/components/shared/CustomInput';
import CustomButton from '@/components/shared/CustomButton';
import CustomSelect from '@/components/shared/CustomSelect';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';
import { capitalizeFirstLetter } from '@/lib/utils';
import { organizationValidationSchema } from '@/components/pages/Organizations/OrganizationActionForm/organizationValidationSchema';
import { IOrganization, IOrganizationFormValues, IUser } from '@/types';

interface IOrganizationListEditableItemProps {
  item: IOrganization;
  onCancelEditing: () => void;
  onOrganizationEdit: (item: IOrganization) => void;
}

const OrganizationListEditableItem = ({
  item,
  onCancelEditing,
  onOrganizationEdit,
}: IOrganizationListEditableItemProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<IUser[] | []>([]);

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, defaultValues },
  } = useForm({
    defaultValues: {
      name: '',
      admin: '',
    },
    resolver: yupResolver(organizationValidationSchema),
  });

  useEffect(() => {
    if (item && defaultValues) {
      const keys = Object.keys(defaultValues);
      keys.forEach((key) => {
        if (key === 'admin') {
          setValue('admin', item[key]._id);
        } else {
          // @ts-ignore
          setValue(key as keyof IOrganizationFormValues, item[key]);
        }
      });
    }
  }, [defaultValues, item, setValue]);

  const onSaveChanges = useCallback(
    async (data: IOrganizationFormValues) => {
      if (item?._id) {
        try {
          const resp = await axiosClient.patch(
            `/api/organizations/${item._id}`,
            data
          );
          onOrganizationEdit(resp.data);
        } catch (err) {
          toast({
            title: 'Failed',
            description: 'Failed to update organization.',
            variant: 'destructive',
          });
        }
      }
    },
    [item._id, onOrganizationEdit, toast]
  );

  useEffect(() => {
    async function fetchUsers() {
      try {
        const resp = await axiosClient.get('/api/users');
        setUsers(resp.data || []);
      } catch (err) {
        toast({
          title: 'Failed',
          description: 'Failed to fetch users.',
        });
      }
    }

    fetchUsers();
  }, [toast]);

  const usersSelectOptions = useMemo(() => {
    if (users?.length) {
      return users.map((user) => ({
        value: user._id,
        label: capitalizeFirstLetter(user.fullName),
      }));
    }
  }, [users]);

  return (
    <TableRow>
      <TableCell className="w-[200px]">
        <CustomInput
          name={'name'}
          // label={'Username'}
          control={control}
          error={errors.name?.message}
          className="max-w-full"
          inputClassName={'border-none shadow-none'}
        />
      </TableCell>
      <TableCell className="w-[200px]">
        {usersSelectOptions?.length ? (
          <CustomSelect
            options={usersSelectOptions}
            control={control}
            disabled={true}
            placeholder={'Admin'}
            name={'admin'}
            error={errors.admin?.message}
            className={`${errors.admin?.message ? 'pb-0' : 'pb-0'} w-48`}
          />
        ) : null}
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

export default OrganizationListEditableItem;
