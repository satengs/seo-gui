'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../ui/select';

interface ICustomSelectInput {
  onValue: (value: string) => void;
  defaultValue?: string;
}

const DEVICE_TYPES = [
  {
    label: 'Desktop',
    value: 'desktop',
  },
  {
    label: 'Tablet',
    value: 'tablet',
  },
  {
    label: 'Mobile',
    value: 'mobile',
  },
];

const DeviceSelect = ({ onValue, defaultValue }: ICustomSelectInput) => {
  const onValueChange = (value: string) => {
    onValue(value);
  };
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger className="w-[200px] ">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {DEVICE_TYPES.map((option) => (
          <SelectItem key={option.label} value={option.value}>
            {option.label || ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default React.memo(DeviceSelect);
