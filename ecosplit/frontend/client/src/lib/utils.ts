import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 * @param amount - Amount in cents
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // Convert cents to dollars if needed (amount is stored in cents in our schema)
  const dollars = amount / 100;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Format a date string into a human-readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Mar 25, 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get the current week number of the year
 * @returns Current week number (1-52)
 */
export function getCurrentWeek(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000; // milliseconds in a week
  return Math.ceil((diff + start.getDay() * 86400000) / oneWeek);
}

/**
 * Calculate percentage from a value and total
 * @param value - Current value
 * @param total - Maximum value
 * @returns Percentage (0-100)
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

/**
 * Truncate text with ellipsis if it exceeds max length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
