'use client';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomCard from '@/components/shared/CustomCard';
import CustomInput from '@/components/shared/CustomInput';
import CustomButton from '@/components/shared/CustomButton';
import AuthActionLinks from '@/components/pages/Auth/AuthActionLinks';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { signUpValidationSchema } from './signUpValidationSchema';
import { IRegisterFormValues } from '@/types';

const SignUpForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(signUpValidationSchema),
  });

  const onSubmit = async (formData: IRegisterFormValues) => {
    setIsLoading(true);

    try {
      await axiosClient.post('/api/auth/sign-up', formData);
      router.push('/auth/sign-in');
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

  const onSignInAccountClick = useCallback(() => {
    router.push('/auth/sign-in');
  }, [router]);

  return (
    <CustomCard className={'shadow-slate-400 w-full'}>
      <form
        className={'flex flex-col gap-6'}
        onSubmit={handleSubmit(onSubmit)}
        data-testid={'register-form'}
      >
        <CustomInput
          name={'fullName'}
          label={'Username'}
          control={control}
          error={errors.fullName?.message}
        />
        <CustomInput
          name={'email'}
          label={'Email address'}
          control={control}
          error={errors.email?.message}
        />
        <CustomInput
          name={'password'}
          type={'password'}
          label={'Password'}
          eye={true}
          control={control}
          error={errors.password?.message}
        />
        <CustomButton isLoading={isLoading} variant={'primary'} type={'submit'}>
          Sign Up
        </CustomButton>
      </form>
      <AuthActionLinks
        actionTitle={'Have an account?'}
        actionText={'Sign in to your account'}
        actionHandler={onSignInAccountClick}
      />
    </CustomCard>
  );
};

export default SignUpForm;
