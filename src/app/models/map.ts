import { IRangeData } from './range';
import { MarkerType } from 'igniteui-angular-charts';

export interface IGeographicShapeSeries {
  name: string;
  shapeDataSource: string;
  databaseSource: string;
  brush: string;
  outline: string;
 }

export interface IGeographicProportionalSymbolSeries {
  name: string;
  latitudeMemberPath: string;
  longitudeMemberPath: string;
  markerType: MarkerType;
  radiusMemberPath: string;
  markerOutline: string;
  markerBrush: string;
 }

export interface IMapData extends IRangeData {
  mapCurrent: any;
}
