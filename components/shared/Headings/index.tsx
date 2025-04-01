import React from 'react';
import { mergeClassNames } from '@/utils';

interface IHeadingProps {
  headingText: string;
  className?: string;
}

export const H1 = ({ headingText, className = '' }: IHeadingProps) => {
  return (
    <h1
      className={mergeClassNames(
        `text-2xl text-gray-700 font-semibold mt-6 text-center`,
        className
      )}
    >
      {headingText}
    </h1>
  );
};
