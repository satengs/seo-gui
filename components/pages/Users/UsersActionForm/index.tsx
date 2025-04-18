'use client';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '@/components/shared/CustomInput';
import CustomSelect from '@/components/shared/CustomSelect';
import CustomButton from '@/components/shared/CustomButton';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { capitalizeFirstLetter } from '@/lib/utils';
import { userAddValidationSchema } from '@/components/pages/Users/UsersActionForm/userAddValidationSchema';
import { IRegisterFormValues, IUser } from '@/types';

interface IUsersActionFormProps {
  onUserAdd: (item: IUser) => void;
}

const UsersActionForm = ({ onUserAdd }: IUsersActionFormProps) => {
  const { toast } = useToast();
  const { roles } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: '',
    },
    resolver: yupResolver(userAddValidationSchema),
  });

  const onSubmit = async (formData: IRegisterFormValues) => {
    setIsLoading(true);

    try {
      const resp = await axiosClient.post('/api/users', formData);
      onUserAdd(resp.data);
      reset();
      toast({
        title: 'Success',
        description: 'User successfully registered',
      });
    } catch (err) {
      toast({
        title: 'failed',
        description: 'User creation failed.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = useMemo(() => {
    if (roles?.length) {
      return roles.map((role) => ({
        value: role._id,
        label: capitalizeFirstLetter(role.name),
      }));
    }
    return [];
  }, [roles]);

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
          name={'fullName'}
          placeholder={'Full Name'}
          control={control}
          error={errors.fullName?.message}
        />
        <CustomInput
          name={'email'}
          placeholder={'Email'}
          control={control}
          error={errors.email?.message}
        />
        <CustomInput
          name={'password'}
          placeholder={'Password'}
          type={'password'}
          eye={true}
          control={control}
          error={errors.password?.message}
        />

        <CustomSelect
          options={roleOptions}
          control={control}
          placeholder={'Role'}
          name={'role'}
          error={errors.role?.message}
          className={`${errors.role?.message ? 'pb-0' : 'pb-0'} w-48`}
        />
        <CustomButton isLoading={isLoading} variant={'primary'} type={'submit'}>
          Add
        </CustomButton>
      </form>
    </div>
  );
};

export default React.memo(UsersActionForm);
