import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes using clsx and tailwind-merge
 * This allows for conditional classes and proper Tailwind class merging
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // Returns: 'py-1 px-4'
 * cn('text-blue-500', condition && 'text-red-500') // Conditionally applies classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
