import { AdModel, Numeric } from './range';

export interface IDoughnutPalette {
  value: string;
  bkg: string;
  label: string;
}

/** Ring colours per channel, for the previous (`start`) and current (`end`) period. */
export type IDoughnutColors = Record<AdModel, Record<'start' | 'end', IDoughnutPalette>>;

export interface IDoughnutDataRecord {
  label: string;
  value: Numeric;
  prev: Numeric;
  /** Toggled by slice selection to reveal the percentage label. */
  showLabel?: boolean;
}
