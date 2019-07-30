import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

const monthsDaysCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const monthsDaysCountLeapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

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

function isLeapYear(year)
{
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

export function dateRangeEqualize( startRangeBegin: Date,
                                   startRangeEnd: Date,
                                   endRangeBegin: Date,
                                   endRangeEnd: Date): boolean  {
                const beginSpan: number = startRangeEnd.getTime() - startRangeBegin.getTime();
                const endSpan: number =  endRangeEnd.getTime() - endRangeBegin.getTime();

                const diff: number = beginSpan - endSpan;

                return diff === 0 ;
}


export function getDays(date: Date, monthsToSubstract: number): number {
  let monthsDays;

  if (isLeapYear(date.getFullYear())) {
    monthsDays = monthsDaysCountLeapYear;
  } else {
    monthsDays = monthsDaysCount;
  }

  let days = 0;
  for (let index = date.getMonth() - monthsToSubstract; index < date.getMonth(); index++) {
    days += monthsDays[index];
  }
  return days;
}
