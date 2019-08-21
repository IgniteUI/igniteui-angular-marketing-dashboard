import { IRange } from './models/range';


function isLeapYear(year) {
  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
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
