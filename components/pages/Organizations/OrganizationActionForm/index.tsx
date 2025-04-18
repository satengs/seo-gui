'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '@/components/shared/CustomInput';
import CustomButton from '@/components/shared/CustomButton';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { organizationValidationSchema } from './organizationValidationSchema';
import { IOrganization, IOrganizationFormValues, IUser } from '@/types';
import CustomSelect from '@/components/shared/CustomSelect';
import { capitalizeFirstLetter } from '@/lib/utils';

interface IOrganizationActionFormProps {
  onOrganizationAdd: (item: IOrganization) => void;
}

const OrganizationActionForm = ({
  onOrganizationAdd,
}: IOrganizationActionFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[] | []>([]);
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      admin: '',
    },
    resolver: yupResolver(organizationValidationSchema),
  });

  const onSubmit = async (formData: IOrganizationFormValues) => {
    setIsLoading(true);

    try {
      const resp = await axiosClient.post('/api/organizations', formData);
      onOrganizationAdd(resp.data);
      reset();
      toast({
        title: 'Success',
        description: 'Organization successfully registered',
      });
    } catch (err) {
      toast({
        title: 'Failed',
        description: 'Organization creation failed.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    return [];
  }, [users]);

  return (
    <div
      className={
        'shadow-slate-400 w-full flex items-center justify-items-start my-5'
      }
    >
      <form
        className={'flex items-end justify-center gap-6'}
        onSubmit={handleSubmit(onSubmit)}
        data-testid={'register-form'}
      >
        <CustomInput
          name={'name'}
          placeholder={'Name'}
          control={control}
          error={errors.name?.message}
        />

        {usersSelectOptions?.length ? (
          <CustomSelect
            options={usersSelectOptions}
            control={control}
            placeholder={'Admin'}
            name={'admin'}
            error={errors.admin?.message}
            className={`${errors.admin?.message ? 'pb-0' : 'pb-0'} w-48`}
          />
        ) : null}

        <CustomButton isLoading={isLoading} variant={'primary'} type={'submit'}>
          Add
        </CustomButton>
      </form>
    </div>
  );
};

export default React.memo(OrganizationActionForm);
