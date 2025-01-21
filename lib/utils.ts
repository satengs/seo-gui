import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkDateDifference(dateOne: any, dateTwo: any) {
  const msInOneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in one day

  // Get the absolute difference in milliseconds
  const differenceInMs = Math.abs(dateOne - dateTwo);

  // Convert milliseconds to full days
  const differenceInDays = Math.floor(differenceInMs / msInOneDay);

  return differenceInDays;
}
