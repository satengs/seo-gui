'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomCard from '@/components/shared/CustomCard';
import CustomInput from '@/components/shared/CustomInput';
import CustomButton from '@/components/shared/CustomButton';
import RememberMeBox from '@/components/pages/Auth/SignIn/RememberMeBox';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { signInValidationSchema } from './signInValidationSchema';
import { ILoginFormValues } from '@/types';
import AuthActionLinks from '@/components/pages/Auth/AuthActionLinks';

const SignInForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(signInValidationSchema),
  });

  const onSubmit = async (formData: ILoginFormValues) => {
    setIsLoading(true);
    try {
      await axiosClient.post('/api/auth/sign-in', formData);
      toast({
        title: 'Success',
        description: 'Successfully signed in..',
      });
      router.push('/');
    } catch (err: any) {
      toast({
        title: 'Failed',
        description: err?.response?.data?.message || 'Credentials are invalid',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCreateAccountClick = useCallback(() => {
    router.push('/auth/sign-up');
  }, [router]);

  return (
    <CustomCard className={'shadow-slate-400 w-full'}>
      <form
        className={'flex flex-col gap-6'}
        onSubmit={handleSubmit(onSubmit)}
        data-testid={'login-form'}
      >
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
          Sign In
        </CustomButton>
        <RememberMeBox />

        <AuthActionLinks
          actionTitle={`Don't have an account?`}
          actionText={'Create your account'}
          actionHandler={onCreateAccountClick}
        />
      </form>
    </CustomCard>
  );
};

export default SignInForm;
