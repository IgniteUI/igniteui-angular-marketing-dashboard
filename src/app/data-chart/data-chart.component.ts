import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxStackedFragmentSeriesComponent } from 'igniteui-angular-charts/ES5/igx-stacked-fragment-series-component';
import { DataService } from '../data.service';
import { IgxCategoryXAxisComponent } from 'igniteui-angular-charts/ES5/igx-category-x-axis-component';
import { IgxCategoryYAxisComponent } from 'igniteui-angular-charts/ES5/igx-category-y-axis-component';
import { IgxDataChartComponent } from 'igniteui-angular-charts/ES5/igx-data-chart-component';
import { IgxNumericXAxisComponent } from 'igniteui-angular-charts/ES5/igx-numeric-x-axis-component';
import { IgxNumericYAxisComponent } from 'igniteui-angular-charts/ES5/igx-numeric-y-axis-component';
import { IgxStackedColumnSeriesComponent } from 'igniteui-angular-charts/ES5/igx-stacked-column-series-component';
import { IRangeData } from '../models/range';
interface IColumnSeriesData {
  name: string;
  xAxis: string;
  valueMemberPath: string;
  title: string;
  brush: string;
  outline: string;
  dataSource?: boolean;
}

interface IChartDataRecord {
  title: any;
  session: any;
  conversion: any;
}

@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit {

  @ViewChild(IgxDataChartComponent, { static: true })
  public chart: IgxDataChartComponent;

  public columnChartCurrentData: IColumnSeriesData[] = [];
  public columnChartPrevData: IColumnSeriesData[] = [];

  public currentPeriodFragments: IgxStackedFragmentSeriesComponent[] = [];
  public prevPeriodFragments: IgxStackedFragmentSeriesComponent[] = [];

  // public currentDataStackedColumnSeries: IgxStackedColumnSeriesComponent;
  // public prevDataStackedColumnSeries: IgxStackedColumnSeriesComponent;

  // public time: IgxCategoryXAxisComponent ;
  // public timeConvers: IgxCategoryXAxisComponent;

  // public numYAxis: IgxNumericYAxisComponent;

  public chartData;
  public prevSeriesDataSource;

  constructor(private service: DataService) {

    this.columnChartCurrentData = [{
      name: 'sessions',
      xAxis: 'time',
      valueMemberPath: 'session',
      title: 'Session',
      brush: '#ffff33',
      outline: '#ffff33'
    }, {
      name: 'conversion',
      xAxis: 'timeConvers',
      valueMemberPath: 'conversion',
      title: 'Conversions',
      brush: '#66cc00',
      outline: '#66cc00',
    }, {
      name: 'sessionsPrev',
      xAxis: 'time',
      valueMemberPath: 'session',
      title: 'Prev.Session',
      brush: '#655F00',
      outline: '#655F00',
      dataSource: true,
    }, {
      name: 'conversionPrev',
      xAxis: 'timeConvers',
      valueMemberPath: 'conversion',
      title: 'Prev.Conversions',
      brush: '#295001',
      outline: '#295001',
      dataSource: true,
    }];

    this.columnChartPrevData = [];


  }

  private mediumMode = false;

  ngOnInit() {

    this.service.onDataFetch.subscribe((data: IRangeData) => {
      this.chart.axes.clear();
      this.chart.series.clear();

      this.chartData = [];
      this.prevSeriesDataSource = [];



      data.end.trafficStats.forEach(stat => {
        this.chartData.push({ session: stat.session, conversion: stat.conversion, title: stat.title });
      });

      data.start.trafficStats.forEach(stat => {
        this.prevSeriesDataSource.push({ session: stat.session, conversion: stat.conversion, title: stat.title });
      });

    });
  }
}
