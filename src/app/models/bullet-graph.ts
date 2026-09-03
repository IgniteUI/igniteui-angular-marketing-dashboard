import { AdModel, Numeric } from './range';

export interface IBulletGraph {
  adModel: AdModel;
  value: Numeric;
  maximumValue: Numeric;
  target: Numeric;
  valueBrush: string;
  bkgBrush: string;
  labelBrush: string;
}
