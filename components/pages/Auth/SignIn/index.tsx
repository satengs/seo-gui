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
import { signInValidationSchema } from './signInValidationSchema';
import { ILoginFormValues } from '@/types';

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
      console.log('err: ', err);
      toast({
        title: 'Failed',
        description: err?.response?.data?.message || 'Credentials are invalid',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log('a');

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
      </form>
      <AuthActionLinks
        actionTitle={"Haven't account yet?"}
        actionText={'Create an account'}
        actionHandler={onCreateAccountClick}
      />
    </CustomCard>
  );
};

export default SignInForm;
