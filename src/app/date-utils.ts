/**
 * Local-time calendar arithmetic (replaces `moment`). Preserves time-of-day
 * across DST, which plain millisecond maths does not.
 */

const MS_PER_DAY = 86_400_000;

/** Number of days in the given month (`month` is 0-based). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/** Clamps to the month's length: 31 Mar minus 1 month is 28 Feb, not 3 Mar. */
export function subtractMonths(date: Date, months: number): Date {
  const day = date.getDate();
  const result = new Date(date.getTime());
  result.setDate(1);
  result.setMonth(result.getMonth() - months);
  result.setDate(Math.min(day, daysInMonth(result.getFullYear(), result.getMonth())));
  return result;
}

/** Whole days between two dates; rounded so a DST hour cannot shift the count. */
export function diffInDays(later: Date, earlier: Date): number {
  return Math.round((later.getTime() - earlier.getTime()) / MS_PER_DAY);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
