import * as timespan from 'timespan';

export interface IRange {
  endRangeEnd: Date;
  endRangeBegin: Date;
  startRangeBegin: Date;
  startRangeEnd: Date;
}
const ts = new timespan.TimeSpan();


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

export function dateRangeEqualize( startRangeBegin: Date,
                                   startRangeEnd: Date,
                                   endRangeBegin: Date,
                                   endRangeEnd: Date): boolean  {
                const beginSpan: number = startRangeEnd.getTime() - startRangeBegin.getTime();
                const endSpan: number =  endRangeEnd.getTime() - endRangeBegin.getTime();

                const diff: number = beginSpan - endSpan;

                return diff === 0 ;
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
