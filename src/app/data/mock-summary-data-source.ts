/**
 * Local stand-in for the hosted endpoint: same payload shape, bucketing and
 * localisation, and random per request, exactly as that service behaved.
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Locale } from '../localization.service';
import {
  ILocationStat,
  IMediumStat,
  IPeriodData,
  IRange,
  IRangeData,
  ITrafficMedium,
  ITrafficStat
} from '../models/range';
import { SummaryDataSource } from './summary-data-source';
import { diffInDays } from '../date-utils';

/** Cities the map plots, with the coordinates the shape series expects. */
const LOCATIONS: readonly Omit<ILocationStat, 'session' | 'conversion' | 'scaledSessions'>[] = [
  { country: 'Poland', latitude: 52.21, longitude: 21, scale: 200 },
  { country: 'England', latitude: 51.5, longitude: 0.12, scale: 200 },
  { country: 'Germany', latitude: 52.5, longitude: 13.33, scale: 200 },
  { country: 'Russia', latitude: 55.75, longitude: 37.51, scale: 200 },
  { country: 'Australia', latitude: -33.83, longitude: 151.2, scale: 200 },
  { country: 'Japan', latitude: 35.6895, longitude: 139.6917, scale: 200 },
  { country: 'South Korea', latitude: 37.5665, longitude: 126.978, scale: 200 },
  { country: 'India', latitude: 28.6353, longitude: 77.225, scale: 200 },
  { country: 'India', latitude: 19.0177, longitude: 72.8562, scale: 200 },
  { country: 'Philippines', latitude: 14.601, longitude: 120.9762, scale: 200 },
  { country: 'China', latitude: 31.2244, longitude: 121.4759, scale: 200 },
  { country: 'Mexico', latitude: 19.427, longitude: -99.1276, scale: 200 },
  { country: 'United States', latitude: 40.7561, longitude: -73.987, scale: 200 },
  { country: 'Brasil', latitude: -23.5489, longitude: -46.6388, scale: 200 },
  { country: 'United States', latitude: 34.0522, longitude: -118.2434, scale: 200 },
  { country: 'Bulgaria', latitude: 42.697845, longitude: 23.321925, scale: 200 }
];

const MEDIUMS = ['organic', 'paid', 'direct', 'referral', 'email'] as const;

const KEYWORDS: Record<Locale, readonly string[]> = {
  en: [
    ' semiconductors', ' shopping cart solutions', 'press releases', ' web design',
    ' web development ', ' government and trade', ' media coverage',
    ' virtual server hosting', ' office supplies', ' web hosting'
  ],
  ja: [
    ' スタートアップ', ' オンライン ストア', ' マーケティング ROI',
    ' ショッピング カート ソリューション', ' web 開発', ' チェック リスト', ' メディア',
    ' オフィス製品', ' ソフトウェア', ' SEO'
  ]
};

const TOP_PAGES: Record<Locale, readonly string[]> = {
  en: [
    ' my-iphone-is-my-computer', 'get-to-your-work', ' top-5-UX-projects', ' 7-deadly-assumptions'
  ],
  ja: [
    ' marketing-projects-with-roi', ' how-we-can-do-better', ' summer-extravaganza',
    ' ios-controls-help'
  ]
};

/** Bucket labels, matching the strings the hosted endpoint returned. */
const BUCKET_LABEL: Record<Locale, Record<BucketUnit, (n: number) => string>> = {
  en: {
    day: n => `Day ${n}`,
    week: n => `Week ${n}`,
    month: n => `Month ${n}`
  },
  ja: {
    day: n => `${n} 日目`,
    week: n => `${n} 週目`,
    month: n => `${n} か月目`
  }
};

type BucketUnit = 'day' | 'week' | 'month';

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** "12,345" - the thousands-separated form the endpoint returned for counts. */
const grouped = (value: number): string => value.toLocaleString('en-US');

/** "443.8K" - the abbreviated form used for the users tile. */
const abbreviated = (value: number): string =>
  value >= 1000 ? `${Math.round(value / 100) / 10}K` : `${value}`;

/** A week buckets per day, a month per week, anything longer per month. */
function bucketsFor(range: IRange): { unit: BucketUnit; count: number } {
  const days = Math.max(diffInDays(range.endRangeEnd, range.endRangeBegin) + 1, 1);

  if (days <= 7) {
    return { unit: 'day', count: days };
  }
  if (days <= 31) {
    return { unit: 'week', count: Math.max(Math.floor(days / 7), 1) };
  }
  return { unit: 'month', count: Math.max(Math.round(days / 30), 1) };
}

function buildPerLocation(bucketSessions: number): ILocationStat[] {
  // Split the bucket's sessions across the cities, then scale into the radius
  // range the proportional-symbol series maps onto marker size.
  const weights = LOCATIONS.map(() => randomInt(1, 10));
  const total = weights.reduce((sum, w) => sum + w, 0);
  const peak = Math.max(...weights);

  return LOCATIONS.map((location, i) => {
    const session = Math.round((weights[i] / total) * bucketSessions);
    return {
      ...location,
      session,
      conversion: Math.round(session * (randomInt(20, 60) / 1000)),
      scaledSessions: Math.max(Math.round((weights[i] / peak) * 10), 1)
    };
  });
}

function buildPerMedium(bucketSessions: number, bucketConversions: number): IMediumStat[] {
  const weights = MEDIUMS.map(() => randomInt(3, 10));
  const total = weights.reduce((sum, w) => sum + w, 0);

  return MEDIUMS.map((title, i) => ({
    title,
    session: Math.round((weights[i] / total) * bucketSessions),
    conversion: Math.round((weights[i] / total) * bucketConversions)
  }));
}

function buildPeriod(range: IRange, locale: Locale, scale: number): IPeriodData {
  const { unit, count } = bucketsFor(range);
  const label = BUCKET_LABEL[locale][unit];

  const trafficStats: ITrafficStat[] = [];
  const trafficPerMedium: ITrafficMedium[] = [];

  for (let i = 0; i < count; i++) {
    const title = label(i + 1);
    const session = Math.round(randomInt(24_000, 38_000) * scale);
    const conversion = Math.round(session * (randomInt(12, 22) / 1000));
    const perMedium = buildPerMedium(session, conversion);

    trafficStats.push({ title, session, conversion, perLocation: buildPerLocation(session), perMedium });
    trafficPerMedium.push({
      title,
      session,
      conversion,
      organic: perMedium[0].session as number,
      paid: perMedium[1].session as number,
      direct: perMedium[2].session as number,
      referral: perMedium[3].session as number,
      email: perMedium[4].session as number
    });
  }

  const sessions = trafficStats.reduce((sum, s) => sum + (s.session as number), 0);
  const conversions = trafficStats.reduce((sum, s) => sum + (s.conversion as number), 0);
  const spend = Math.round(conversions * randomInt(16, 24));

  // The four advertising channels, plus the target each is measured against.
  const ppc = Math.round(conversions * (randomInt(20, 34) / 100));
  const banners = Math.round(conversions * (randomInt(8, 16) / 100));
  const email = Math.round(conversions * (randomInt(8, 16) / 100));
  const thirdParty = Math.max(conversions - ppc - banners - email, 0);
  const target = Math.round(conversions / 2);

  return {
    sessions: grouped(sessions),
    conversions: grouped(conversions),
    spend: grouped(spend),
    conversionCosts: (spend / Math.max(conversions, 1)).toFixed(2),
    users: abbreviated(Math.round(sessions * (randomInt(95, 105) / 100))),
    conversionRate: ((conversions / Math.max(sessions, 1)) * 100).toFixed(1),
    referringDomains: grouped(randomInt(1_000, 3_000)),
    brandedSearches: grouped(randomInt(800, 2_400)),
    onlineSales: grouped(Math.round(spend * randomInt(1, 3))),
    socialTrend: grouped(randomInt(100_000, 220_000)),
    topPages: [...TOP_PAGES[locale]],
    keywords: [...KEYWORDS[locale]],
    ppc,
    ppcTarget: target,
    banners,
    bannersTarget: target,
    email,
    emailTarget: target,
    thirdParty,
    thirdPartyTarget: target,
    trafficStats,
    trafficPerMedium
  };
}

/** Builds a full comparison for the given range. Exported for tests. */
export function generateSummary(range: IRange, locale: Locale): IRangeData {
  // Give the two periods slightly different scales so the trend tiles move.
  return {
    start: buildPeriod(range, locale, randomInt(85, 105) / 100),
    end: buildPeriod(range, locale, randomInt(85, 115) / 100)
  };
}

@Injectable()
export class MockSummaryDataSource extends SummaryDataSource {
  /** A touch of latency, so loading states behave like they would against a server. */
  private static readonly LATENCY_MS = 150;

  public override fetch(range: IRange, locale: Locale): Observable<IRangeData> {
    return of(generateSummary(range, locale)).pipe(delay(MockSummaryDataSource.LATENCY_MS));
  }
}
