import type { Time } from '../backend';

/**
 * Convert a date string (YYYY-MM-DD) to backend Time (nanoseconds since epoch)
 */
export function dateStringToTime(dateString: string): Time {
  const date = new Date(dateString + 'T00:00:00.000Z');
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

/**
 * Convert backend Time (nanoseconds since epoch) to date string (YYYY-MM-DD)
 */
export function timeToDateString(time: Time): string {
  const milliseconds = Number(time / BigInt(1_000_000));
  const date = new Date(milliseconds);
  return date.toISOString().split('T')[0];
}

/**
 * Format Time as a readable date string
 */
export function formatDate(time: Time): string {
  const milliseconds = Number(time / BigInt(1_000_000));
  const date = new Date(milliseconds);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate days between two Time values
 */
export function daysBetween(startTime: Time, endTime: Time): number {
  const startMs = Number(startTime / BigInt(1_000_000));
  const endMs = Number(endTime / BigInt(1_000_000));
  const diffMs = endMs - startMs;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

