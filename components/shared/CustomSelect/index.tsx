'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { mergeClassNames } from '@/utils';
import { ISelectItem } from '@/types';

interface ICustomSelectInput {
  name: string;
  control: any;
  label?: string;
  options: ISelectItem[];
  defaultValue?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const CustomSelect = ({
  name,
  label,
  control,
  options,
  defaultValue,
  className,
  disabled,
  error,
}: ICustomSelectInput) => {
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
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || ''}
        render={({ field }) => {
          return (
            <Select
              {...field}
              value={field.value}
              onValueChange={(value: string) => {
                field.onChange(value);
              }}
              disabled={disabled}
            >
              <SelectTrigger
                className="px-4 w-full py-2 font-medium text-gray-600 h-10 shadow-sm
            text-sm rounded-md dark:bg-white border shadow-gray-200
            placeholder-gray-500 focus:outline-none"
              >
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.label}
                    value={option.value}
                    className={
                      'px-1 cursor-pointer hover:bg-gray-100 hover:rounded-none'
                    }
                  >
                    {option.label || ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      {error ? (
        <p className="text-sm font-medium text-red-800 min-h-[10px]">{error}</p>
      ) : null}
    </div>
  );
};

export default React.memo(CustomSelect);
