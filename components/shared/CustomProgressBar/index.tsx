import React from 'react';
import { motion } from 'framer-motion';

interface IProgressBarProps {
  total: number;
  remaining: number;
  containerClassName: string;
}

const CustomProgressBar = ({
  total,
  remaining,
  containerClassName = '',
}: IProgressBarProps) => {
  const completed = total - remaining;
  const completedPercentage = (completed / total) * 100;
  const remainingPercentage = (remaining / total) * 100;
  return (
    <div className="tracking-wide">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {completed.toLocaleString()} / {total.toLocaleString()} searches
        </span>
      </div>

      <div
        className={`h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner  ${containerClassName}`}
      >
        <div className="flex h-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completedPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-red-500 dark:bg-red-900 h-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${remainingPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-green-500 dark:bg-green-900 h-full"
          />
        </div>
      </div>
    </div>
  );
};
export default CustomProgressBar;
