import { convertToInt } from '../utils';
import { IRangeData } from './range';

export interface ITrendItem {
  name: string;
  end: string;
  start: string;
  percent: number;
  direction: string;
  directionColor: string;
  endRes: string;
  labelP: string;
}

export function generateTrendItem(inditicatorName: string, data: IRangeData, labelP: string, invertStyleRule?: boolean): ITrendItem {
  const endString = data.end[inditicatorName];
  const end = convertToInt(endString);
  const startString = data.start[inditicatorName];
  const start = convertToInt(startString);
  const change = end - start;
  const isPositiveChange = change >= 0;
  const dec = change / start;
  const percent = Math.abs(Math.round(dec * 100));


  let direction = 'down';
  let endRes = 'danger';

  if (isPositiveChange) {
    direction = 'up';
    endRes = 'success';
  }

  if (percent === 0) {
    direction = 'flat';
    endRes = '';
  }


  if (invertStyleRule) {
    endRes = (endRes === 'success') ? 'danger' : 'success';
  }

  let directionColor = 'success';
  if (direction === 'up') {
    directionColor = 'success';
  } else if (direction === 'down') {
    directionColor = 'danger';
  } else {
    directionColor = '';
  }

  if (invertStyleRule) {
    if (direction === 'up') {
      directionColor = 'danger';
    } else if (direction === 'down') {
      directionColor = 'success';
    } else {
      directionColor = '';
    }
  }

  return {
    name: inditicatorName,
    end: endString,
    start: startString,
    percent: percent,
    direction: direction,
    directionColor: directionColor,
    endRes: endRes,
    labelP: labelP
  };
}
