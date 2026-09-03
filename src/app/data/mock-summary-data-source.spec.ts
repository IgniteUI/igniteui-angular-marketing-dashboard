import { generateSummary } from './mock-summary-data-source';
import { getDateRange } from '../utils';
import { convertToInt } from '../utils';
import { generateTrendItem } from '../models/trend-item';
import { IRangeData } from '../models/range';

/** Pins the payload contract the dashboard depends on. */
describe('mock summary data', () => {
  const oneYear = () => generateSummary(getDateRange(365), 'en');

  it('buckets a week per day, a month per week and a year per month', () => {
    const labels = (data: IRangeData) => data.end.trafficStats.map(s => s.title);

    expect(labels(generateSummary(getDateRange(7), 'en'))).toEqual([
      'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'
    ]);
    expect(labels(generateSummary(getDateRange(30), 'en'))).toEqual([
      'Week 1', 'Week 2', 'Week 3', 'Week 4'
    ]);
    expect(labels(generateSummary(getDateRange(365), 'en')).length).toBe(12);
    expect(labels(generateSummary(getDateRange(365), 'en'))[0]).toBe('Month 1');
  });

  it('localises bucket labels and word lists', () => {
    const ja = generateSummary(getDateRange(7), 'ja');
    expect(ja.end.trafficStats[0].title).toBe('1 日目');
    expect(ja.end.keywords[0]).toContain('スタートアップ');
  });

  it('produces counts the dashboard can parse', () => {
    const data = oneYear();
    for (const field of ['sessions', 'conversions', 'spend', 'socialTrend'] as const) {
      expect(convertToInt(data.end[field])).toBeGreaterThan(0);
    }
    // Trend tiles divide by the previous period, so it must not be zero.
    expect(convertToInt(data.start.conversions)).toBeGreaterThan(0);
    expect(generateTrendItem('sessions', data, 'Sessions').percent).not.toBeNaN();
  });

  it('gives every map point real coordinates', () => {
    const locations = oneYear().end.trafficStats[0].perLocation;
    expect(locations.length).toBeGreaterThan(0);
    for (const point of locations) {
      expect(point.country).toBeTruthy();
      expect(Number.isFinite(point.latitude)).toBe(true);
      expect(Number.isFinite(point.longitude)).toBe(true);
      expect(point.scaledSessions).toBeGreaterThan(0);
    }
  });

  it('fills every channel the campaign-health panel charts', () => {
    const end = oneYear().end;
    for (const channel of ['ppc', 'banners', 'email', 'thirdParty'] as const) {
      expect(convertToInt(end[channel])).toBeGreaterThanOrEqual(0);
      expect(convertToInt(end[`${channel}Target` as const])).toBeGreaterThan(0);
    }
  });
});
