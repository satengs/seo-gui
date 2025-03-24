import React, { ButtonHTMLAttributes } from 'react';
import { mergeClassNames } from '@/utils';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  className?: string;
  variant: 'primary' | 'secondary' | 'text';
}

const Button = ({
  children,
  isLoading,
  className = '',
  variant = 'primary',
  ...props
}: IButtonProps) => {
  const variants = {
    primary: 'bg-blue-68 text-white',
    secondary:
      'bg-white text-gray-700 shadow-sm shadow-gray-300 border border-gray-300',
    text: 'bg-white text-gray-700 hover:bg-gray-200 w-full',
  };

  return (
    <button
      disabled={isLoading || props.disabled}
      className={mergeClassNames(
        'px-4 font-medium rounded-md h-10 transform transition-transform hover:scale-105',
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className={'flex items-center justify-center'}>
          <div
            className={
              'w-4 h-4 border-2 border-dashed border-white rounded-full animate-spin'
            }
          />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default React.memo(Button);
