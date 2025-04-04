import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ICustomCheckBoxProps {
  label: string;
  defaultChecked: boolean;
  onCheckBoxValueChange: (value: boolean) => void;
}

const CustomCheckBox = ({
  label,
  defaultChecked,
  onCheckBoxValueChange,
}: ICustomCheckBoxProps) => {
  const [checked, setChecked] = useState<boolean>(false);
  const onCheckBoxChange = (value: boolean) => {
    setChecked(value);
    onCheckBoxValueChange(value);
  };

  useEffect(() => setChecked(defaultChecked), [defaultChecked]);

  return (
    <div className={'flex items-center gap-1 cursor-pointer'}>
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckBoxChange}
        id={'location-checkbox'}
        className={'h-5 w-5 bg-background text-lg '}
      />
      {label ? (
        <label
          htmlFor={'location-checkbox'}
          className={
            'ml-2 text-blue-95 text-center text-sm opacity-60 cursor-pointer'
          }
        >
          {label}
        </label>
      ) : null}
    </div>
  );
};

export default React.memo(CustomCheckBox);
