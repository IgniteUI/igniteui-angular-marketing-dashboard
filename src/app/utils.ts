import { IRange } from './models/range';
import * as moment from 'moment';


export function getDateRange(numberOfDays: number): IRange {

  const today = new Date();
  const startRangeBegin = moment(today).subtract((numberOfDays - 1) * 2 , 'days').toDate();
  const startRangeEnd = moment(today).subtract(numberOfDays - 1, 'days').toDate();
  const endRangeBegin = moment(today).subtract(numberOfDays - 1, 'days').toDate();
  const range = {
    endRange: {start: endRangeBegin, end: today},
    startRange: {start: startRangeBegin, end: startRangeEnd},
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
