import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TableCell, TableRow } from '@/components/ui/table';
import CustomInput from '@/components/shared/CustomInput';
import CustomButton from '@/components/shared/CustomButton';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import axiosClient from '@/lib/axiosClient';
import { IOrganization, IOrganizationFormValues } from '@/types';
import { organizationValidationSchema } from '@/components/pages/Organizations/OrganizationActionForm/organizationValidationSchema';

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

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, defaultValues },
  } = useForm({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(organizationValidationSchema),
  });

  useEffect(() => {
    if (item && defaultValues) {
      const keys = Object.keys(defaultValues);
      keys.forEach((key) => {
        // @ts-ignore
        setValue(key as keyof IOrganizationFormValues, item[key]);
      });
    }
  }, [defaultValues, item, setValue]);

  const onSaveChanges = useCallback(
    async (data: IOrganizationFormValues) => {
      if (item?._id) {
        try {
          console.log('data: ', data);
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
