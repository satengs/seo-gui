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
import LocationMultiSelect from '@/components/shared/LocationMultiSelect';

interface INewLocationFormProps {
  onNewLocation: (date: any) => void;
}

const NewLocationForm = ({ onNewLocation }: INewLocationFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resetFields, setResetFields] = useState<boolean>(false);
  const {
    handleSubmit,
    getValues,
    reset,
    setValue,
    watch,
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

  const formValues = watch();

  const onSubmit = async (formData: INewLocationFormValues) => {
    try {
      setIsLoading(true);
      const response = await axiosClient.post('/api/locations', formData);
      onNewLocation(response?.data || []);

      reset();
      setResetFields(true);
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
        className={'flex gap-6'}
        onSubmit={handleSubmit(onSubmit)}
        data-testid={'login-form'}
      >
        <LocationMultiSelect
          name={'location'}
          setValue={setValue}
          className={'h-10'}
          // error={errors.location?.message}
          resetSelected={resetFields}
        />
        {formValues?.longitude ? (
          <CustomInput name={'longitude'} control={control} disabled={true} />
        ) : null}
        {formValues?.latitude ? (
          <CustomInput name={'latitude'} control={control} disabled={true} />
        ) : null}
        <CustomButton isLoading={isLoading} variant={'primary'} type={'submit'}>
          Add
        </CustomButton>
      </form>
    </div>
  );
};

export default NewLocationForm;
