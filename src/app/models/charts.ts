import { IgxCategoryXAxisComponent } from 'igniteui-angular-charts';

// Series data struct
export interface IColumnSeriesData {
  name: string;
  xAxis: IgxCategoryXAxisComponent;
  valueMemberPath: string;
  brush: string;
  outline: string;
  dataSource?: any;
}

export interface IAreaSeriesData {
  name: string;
  valueMemberPath: string;
  color: string;
}


// Chart data struct
export interface IColumnChartDataRecord {
  title: any;
  session: any;
  conversion: any;
}


export interface IAreaChartDataRecord {
  conversion: number;
  direct: number;
  email: number;
  organic: number;
  paid: number;
  referral: number;
  session: number;
  title: string;
}
