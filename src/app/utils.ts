import { subtractDays } from './date-utils';
import { IRange, Numeric } from './models/range';

export function getDateRange(numberOfDays: number): IRange {
  const current = new Date();

  return {
    endRangeEnd: current,
    endRangeBegin: subtractDays(current, numberOfDays - 1),
    startRangeBegin: subtractDays(current, (numberOfDays - 1) * 2),
    startRangeEnd: subtractDays(current, numberOfDays - 1)
  };
}

/** Normalises a formatted count ("12,345") or a raw number to an integer. */
export function convertToInt(value: Numeric): number {
  if (typeof value === 'number') {
    return value;
  }
  const parsed = parseInt(value.replace(/,/g, ''), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}
