/** The endpoint mixes formatted strings ("12,345") with raw numbers; see `convertToInt`. */
export type Numeric = string | number;

export interface IRange {
  startRangeBegin: Date;
  startRangeEnd: Date;
  endRangeBegin: Date;
  endRangeEnd: Date;
}

/** One data point of the traffic-over-time series. */
export interface ITrafficStat {
  title: string;
  session: Numeric;
  conversion: Numeric;
  perLocation: ILocationStat[];
  perMedium: IMediumStat[];
}

/** Per-medium breakdown carried on each traffic snapshot. */
export interface IMediumStat {
  title: string;
  session: Numeric;
  conversion: Numeric;
}

/** Per-country roll-up plotted on the geographic map. */
export interface ILocationStat {
  country: string;
  session: Numeric;
  conversion: Numeric;
  scale: number;
  scaledSessions: number;
  latitude: number;
  longitude: number;
}

/** One data point of the traffic-by-medium series. */
export interface ITrafficMedium {
  title: string;
  session: Numeric;
  conversion: Numeric;
  direct: Numeric;
  email: Numeric;
  organic: Numeric;
  paid: Numeric;
  referral: Numeric;
}

/** Everything the endpoint reports for a single date range. */
export interface IPeriodData {
  sessions: Numeric;
  conversions: Numeric;
  spend: Numeric;
  conversionCosts: Numeric;
  referringDomains: Numeric;
  brandedSearches: Numeric;
  onlineSales: Numeric;
  socialTrend: Numeric;
  users: Numeric;
  conversionRate: Numeric;
  topPages: string[];
  keywords: string[];
  ppc: Numeric;
  ppcTarget: Numeric;
  banners: Numeric;
  bannersTarget: Numeric;
  email: Numeric;
  emailTarget: Numeric;
  thirdParty: Numeric;
  thirdPartyTarget: Numeric;
  trafficStats: ITrafficStat[];
  trafficPerMedium: ITrafficMedium[];
}

/** The two periods being compared. */
export interface IRangeData {
  start: IPeriodData;
  end: IPeriodData;
}

/** Fields of `IPeriodData` that carry a single comparable count. */
export type TrendField =
  | 'sessions'
  | 'conversions'
  | 'spend'
  | 'conversionCosts'
  | 'referringDomains'
  | 'brandedSearches'
  | 'onlineSales'
  | 'socialTrend';

/** Advertising channels charted by the campaign-health panel. */
export type AdModel = 'ppc' | 'email' | 'banners' | 'thirdParty';
