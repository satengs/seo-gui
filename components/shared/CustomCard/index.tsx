import React from 'react';
import { mergeClassNames } from '@/utils';

interface ICardProps {
  className?: string;
  children: React.ReactNode;
}

const Card = ({ className, children }: ICardProps) => {
  return (
    <section
      className={mergeClassNames(
        'bg-white p-6 rounded-md shadow-gray-200 shadow-sm',
        className
      )}
    >
      {children}
    </section>
  );
};

export default Card;
