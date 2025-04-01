'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '@/components/shared/CustomInput';
import CustomButton from '@/components/shared/CustomButton';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { organizationValidationSchema } from './organizationValidationSchema';
import { IOrganization, IOrganizationFormValues } from '@/types';

interface IOrganizationActionFormProps {
  onOrganizationAdd: (item: IOrganization) => void;
}

const OrganizationActionForm = ({
  onOrganizationAdd,
}: IOrganizationActionFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
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
        title: 'failed',
        description: 'Organization creation failed.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        <CustomButton isLoading={isLoading} variant={'primary'} type={'submit'}>
          Add
        </CustomButton>
      </form>
    </div>
  );
};

export default React.memo(OrganizationActionForm);
