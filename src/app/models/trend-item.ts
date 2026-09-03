import { convertToInt } from '../utils';
import { ResourceKey } from '../localization.service';
import { IRangeData, Numeric, TrendField } from './range';

export type TrendDirection = 'up' | 'down' | 'flat';

export interface ITrendItem {
  name: string;
  end: Numeric;
  start: Numeric;
  percent: number;
  direction: TrendDirection;
  directionColor: string;
  endRes: string;
  labelP: ResourceKey;
}

/** @param invertStyleRule for cost-like metrics, where a rise is bad news. */
export function generateTrendItem(
  indicatorName: TrendField,
  data: IRangeData,
  labelP: ResourceKey,
  invertStyleRule = false
): ITrendItem {
  const endValue = data.end[indicatorName];
  const startValue = data.start[indicatorName];
  const end = convertToInt(endValue);
  const start = convertToInt(startValue);
  const change = end - start;
  const percent = start === 0 ? 0 : Math.abs(Math.round((change / start) * 100));

  let direction: TrendDirection = change >= 0 ? 'up' : 'down';
  let endRes = change >= 0 ? 'success' : 'danger';

  if (percent === 0) {
    direction = 'flat';
    endRes = '';
  }

  if (invertStyleRule && endRes) {
    endRes = endRes === 'success' ? 'danger' : 'success';
  }

  let directionColor = '';
  if (direction === 'up') {
    directionColor = invertStyleRule ? 'danger' : 'success';
  } else if (direction === 'down') {
    directionColor = invertStyleRule ? 'success' : 'danger';
  }

  return {
    name: indicatorName,
    end: endValue,
    start: startValue,
    percent,
    direction,
    directionColor,
    endRes,
    labelP
  };
}
