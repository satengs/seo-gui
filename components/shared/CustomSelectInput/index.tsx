'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../ui/select';

interface ICustomSelectInputItem {
  label: string;
  value: any;
}

interface ICustomSelectInput {
  options: ICustomSelectInputItem[];
  onValue: (value: string) => void;
  defaultValue?: string;
}

const CustomSelectInput = ({
  options,
  onValue,
  defaultValue,
}: ICustomSelectInput) => {
  const onValueChange = (value: string) => {
    onValue(value);
  };
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger className="w-[200px] ">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.label} value={option.value}>
            {option.label || ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default React.memo(CustomSelectInput);
