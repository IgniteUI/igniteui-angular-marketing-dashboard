/**
 * Calendar arithmetic in local time, replacing the handful of `moment` calls
 * the dashboard used. All of these preserve the time-of-day across DST, which
 * plain millisecond arithmetic does not.
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

/**
 * Steps back whole months, clamping the day to the target month's length so
 * that e.g. 31 March minus one month is 28 February rather than 3 March.
 */
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
