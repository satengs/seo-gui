'use client';

import React, { useState, InputHTMLAttributes, ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { mergeClassNames } from '@/utils';
import { Controller } from 'react-hook-form';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: string;
  eye?: boolean;
  type?: string;
  control: any;
  className?: string;
  onInputAdditionalChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  name,
  label,
  error,
  eye,
  control = {},
  type = 'text',
  className = '',
  onInputAdditionalChange,
  ...props
}: IInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordEyeIcon = () =>
    setShowPassword((prevState) => !prevState);

  console.log('value: ', props.value);

  return (
    <div
      className={mergeClassNames(
        'flex flex-col gap-2 justify-center',
        className
      )}
    >
      {label && (
        <label
          htmlFor={name}
          className="text-sm px-1 font-medium text-gray-600 "
        >
          {label}
        </label>
      )}

      <div className="w-full relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type={eye ? (showPassword ? 'text' : 'password') : type}
              className="px-3 py-2 w-full font-medium text-gray-600 h-10 shadow-sm text-sm rounded-md dark:bg-white  border shadow-gray-200 placeholder-gray-500 focus:outline-none"
              {...props}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                field.onChange(e);
                console.log('value:  ', e.target.value);
                // if (onInputAdditionalChange) {
                //   onInputAdditionalChange(e);
                // }
              }}
            />
          )}
        />

        {eye && (
          <div
            onClick={togglePasswordEyeIcon}
            className="absolute right-4 top-3 cursor-pointer"
          >
            {!showPassword ? (
              <Eye width={18} height={18} className={'text-blue-68'} />
            ) : (
              <EyeOff width={18} height={18} className={'text-blue-68'} />
            )}
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-red-800 min-h-[10px]">
        {error || ''}
      </p>
    </div>
  );
};

export default React.memo(Input);
