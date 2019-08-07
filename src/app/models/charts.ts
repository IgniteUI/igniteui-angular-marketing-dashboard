import { IgxCategoryXAxisComponent } from 'igniteui-angular-charts/ES5/igx-category-x-axis-component';

// Series data struct
export interface IColumnSeriesData {
  name: string;
  xAxis: IgxCategoryXAxisComponent;
  valueMemberPath: string;
  title: string;
  brush: string;
  outline: string;
  dataSource?: any;
}

export interface IAreaSeriesData {
  name: string;
  valueMemberPath: string;
  title: string;
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
