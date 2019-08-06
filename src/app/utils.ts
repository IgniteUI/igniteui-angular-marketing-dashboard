import { IRange } from './models/range';


export function shuffle(items: any[]): void {
  let count: number = items.length;
  while (count > 1) {
    count--;
    const rdm = Math.floor(Math.random() * items.length);

    const temp: any = items[rdm];
    items[rdm] = items[count];
    items[count] = temp;

  }

}

function isLeapYear(year) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

export function dateRangesValidator(startRangeBegin: Date,
                                    startRangeEnd: Date,
                                    endRangeBegin: Date,
                                    endRangeEnd: Date): boolean {

  const dayMiliseconds = 1000 * 60 * 60 * 24;

  const beginSpan: number = Math.floor((startRangeEnd.getTime() - startRangeBegin.getTime()) / dayMiliseconds);
  const endSpan: number = Math.floor((endRangeEnd.getTime() - endRangeBegin.getTime()) / dayMiliseconds);
  if (beginSpan <= 0 || endSpan <= 0) {
    throw new Error('End date cannot be before start date');
  }

  const diff: number = beginSpan - endSpan;
  if ((isLeapYear(startRangeBegin.getFullYear()) && diff === 1 && beginSpan === 366) ||
    (isLeapYear(endRangeBegin.getFullYear()) && diff === 1 && endSpan === 366)) {
    return true;
  }

  if (diff === 0) {
    return true;

  } else {
    throw new Error('The beginning and end date ranges must have an equal number of days.');
  }
}


export function getDateRange(numberOfDays: number): IRange {

  const dayMiliseconds = 1000 * 60 * 60 * 24;
  if (!numberOfDays) {
    numberOfDays = 365;
  }

  const current = new Date();

  const range = {
    endRangeEnd: current,

    endRangeBegin: new Date(current.getTime() - dayMiliseconds * numberOfDays),

    startRangeBegin: new Date(current.getTime() - dayMiliseconds * numberOfDays * 2),

    startRangeEnd: new Date(current.getTime() - dayMiliseconds * numberOfDays)
  };

  return range;
}

export function convertToInt(numStr: string) {
  return parseInt(numStr.replace(/,/g, ''));
}

export function setTitle(title: string): string {
  let res = '';
  const upperCaseChars = title.match(/[A-Z]{1,}/g);
  for (let index = 0; index < upperCaseChars.length; index++) {
    if (!(index === upperCaseChars.length - 1)) {
      res += title.substring(title.indexOf(upperCaseChars[index]),
        title.indexOf(upperCaseChars[index + 1])) + ' ';
    } else {
      res += title.substring(0, title.indexOf(upperCaseChars[index])) + ' ';
      res += title.substring(title.indexOf(upperCaseChars[index]));
    }
  }
  return res;
}
