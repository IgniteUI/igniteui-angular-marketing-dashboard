import { IgxCategoryXAxisComponent } from 'igniteui-angular-charts';
import { ResourceKey } from '../localization.service';
import { ITrafficStat } from './range';

/** Configuration for one dynamically created column series. */
export interface IColumnSeriesData {
  name: ResourceKey;
  xAxis: IgxCategoryXAxisComponent;
  valueMemberPath: string;
  brush: string;
  outline: string;
  dataSource?: ITrafficStat[];
}

/** Configuration for one dynamically created area series. */
export interface IAreaSeriesData {
  name: ResourceKey;
  valueMemberPath: string;
  color: string;
}
