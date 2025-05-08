import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToast } from '@/hooks/use-toast';
import axiosClient from '@/lib/axiosClient';
import { newLocationValidationSchema } from './newLocationValidationSchema';
import { INewLocationFormValues } from '@/types';
import CustomInput from '@/components/shared/CustomInput';
import CustomButton from '@/components/shared/CustomButton';
import RememberMeBox from '@/components/pages/Auth/SignIn/RememberMeBox';
import LocationMultiSelect from '@/components/shared/LocationMultiSelect';

const NewLocationForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: '',
      longitude: 0,
      latitude: 0,
    },
    resolver: yupResolver(newLocationValidationSchema),
  });

  const formValues = getValues();

  console.log('form values: ', formValues);

  const onSubmit = async (formData: INewLocationFormValues) => {
    console.log('form data: ', formData);
    setIsLoading(true);
    try {
      toast({
        title: 'Success',
        description: 'New location was added successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Failed',
        description:
          err?.response?.data?.message || 'Failed to create new keyword',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form
        className={'flex flex-col gap-6'}
        onSubmit={handleSubmit(onSubmit)}
        data-testid={'login-form'}
      >
        <LocationMultiSelect name={'location'} setValue={setValue} />
        {}
        <CustomButton isLoading={isLoading} variant={'primary'} type={'submit'}>
          Add
        </CustomButton>
      </form>
    </div>
  );
};

export default NewLocationForm;
