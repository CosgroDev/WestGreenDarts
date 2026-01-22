import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format a date and time to a readable string
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calculate 3-dart average
 */
export function calculate3DartAverage(totalScore: number, totalVisits: number): number {
  if (totalVisits === 0) return 0
  return parseFloat((totalScore / totalVisits).toFixed(2))
}

/**
 * Calculate percentage
 */
export function calculatePercentage(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return parseFloat(((numerator / denominator) * 100).toFixed(2))
}

/**
 * Format a number with comma separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-GB')
}

/**
 * Get season name from current date
 */
export function getCurrentSeasonName(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 0-indexed

  // Assume season starts in September (month 9)
  if (month >= 9) {
    return `${year.toString().slice(-2)}/${(year + 1).toString().slice(-2)}`
  } else {
    return `${(year - 1).toString().slice(-2)}/${year.toString().slice(-2)}`
  }
}
