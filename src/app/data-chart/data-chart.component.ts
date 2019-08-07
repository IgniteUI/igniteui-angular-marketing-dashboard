import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { IgxCategoryXAxisComponent } from 'igniteui-angular-charts/ES5/igx-category-x-axis-component';
import { IgxDataChartComponent } from 'igniteui-angular-charts/ES5/igx-data-chart-component';
import { IgxNumericYAxisComponent } from 'igniteui-angular-charts/ES5/igx-numeric-y-axis-component';
import { IRangeData } from '../models/range';
import { IgxColumnSeriesComponent } from 'igniteui-angular-charts/ES5/igx-column-series-component';
import { IgxAreaSeriesComponent } from 'igniteui-angular-charts/ES5/igx-area-series-component';
import { IgxCategoryToolTipLayerComponent} from 'igniteui-angular-charts/ES5/igx-category-tool-tip-layer-component';

import { IColumnSeriesData, IColumnChartDataRecord, IAreaChartDataRecord, IAreaSeriesData } from '../models/charts';
import { CategoryTooltipLayerPosition } from 'igniteui-angular-charts/ES5/CategoryTooltipLayerPosition';
@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit {

  @ViewChild(IgxDataChartComponent, { static: true })
  public chart: IgxDataChartComponent;

  @ViewChild('time', { read: IgxCategoryXAxisComponent, static: true })
  public time: IgxCategoryXAxisComponent;

  @ViewChild('timeConvers', { read: IgxCategoryXAxisComponent, static: true })
  public timeConvers: IgxCategoryXAxisComponent;

  @ViewChild('yAxis', { read: IgxNumericYAxisComponent, static: true })
  public yAxis: IgxNumericYAxisComponent;

  @ViewChild('areaChartTooltipTemplate', {read: TemplateRef, static: false})
  public areaChartTooltipTemplate: TemplateRef<any>;

  @ViewChild('emptyAreChartTooltipTemplate', {read: TemplateRef, static: false})
  public emptyreAChartTooltipTemplate: TemplateRef<any>;

  @ViewChild('columnChartTooltipTemplate', {read: TemplateRef, static: false})
  public columnChartTooltipTemplate: TemplateRef<any>;

  public columnSeriesData: IColumnSeriesData[] = [];

  public areaSeriesData: IAreaSeriesData[] = [];


  public chartData: Array<IColumnChartDataRecord | IAreaChartDataRecord> = [];

  public columnChartData: Array<IColumnChartDataRecord> = [];
  public areaChartData: Array<IAreaChartDataRecord> = [];
  public prevSeriesDataSource: Array<IColumnChartDataRecord> = [];

  public mediumMode = false;

  constructor(private service: DataService) { }


  ngOnInit() {

    this.service.onDataFetch.subscribe((data: IRangeData) => {
      this.chart.series.clear();
      this.chartData = [];
      this.prevSeriesDataSource = [];
      this.areaChartData = [];
      this.columnChartData = [];
      this.columnSeriesData = [];
      this.areaSeriesData = [];

      data.end.trafficStats.forEach(stat => {

        this.columnChartData.push({ session: stat.session, conversion: stat.conversion, title: stat.title });
      });

      data.start.trafficStats.forEach(stat => {
        this.prevSeriesDataSource.push({ session: stat.session, conversion: stat.conversion, title: stat.title });
      });

      data.end.trafficPerMedium.forEach(medium => {
        this.areaChartData.push({
          conversion: medium.conversion,
          session: medium.session,
          direct: medium.direct,
          email: medium.email,
          organic: medium.organic,
          paid: medium.paid,
          referral: medium.referral,
          title: medium.title
        });
      });


      this.columnSeriesData.push(this.setColumnSeriesData('sessions', this.time, 'session', 'Session', '#ffff33', '#ffff33'));
        // tslint:disable-next-line: max-line-length
      this.columnSeriesData.push(this.setColumnSeriesData('conversion', this.timeConvers, 'conversion', 'Conversions', '#66cc00', '#66cc00'));

        // tslint:disable-next-line: max-line-length
      this.columnSeriesData.push(this.setColumnSeriesData('sessionsPrev', this.time, 'session', 'Prev.Session', '#655F00', '#655F00', this.prevSeriesDataSource));
        // tslint:disable-next-line: max-line-length
      this.columnSeriesData.push(this.setColumnSeriesData('conversionPrev', this.timeConvers, 'conversion', 'Prev.Conversions', '#295001', '#295001', this.prevSeriesDataSource));

      this.areaSeriesData.push(this.setAreaSeriesData('organic', '#77B40D'));
      this.areaSeriesData.push(this.setAreaSeriesData('paid', '#A9D120'));
      this.areaSeriesData.push(this.setAreaSeriesData('direct', '#CCE575'));
      this.areaSeriesData.push(this.setAreaSeriesData('referral', '#E1EEB5'));
      this.areaSeriesData.push(this.setAreaSeriesData('email', '#FFFFFF'));

      this.setSeries(this.mediumMode);

    });
  }

  public setSeries(isMediumMode: boolean) {
    this.mediumMode = isMediumMode;
    if (!isMediumMode && this.chartData !== this.columnChartData) {
      this.chart.series.clear();
      this.chartData = this.columnChartData;
      for (const seriesData of this.columnSeriesData) {
        const series = new IgxColumnSeriesComponent();
        series.name = seriesData.name;
        series.valueMemberPath = seriesData.valueMemberPath;
        series.xAxis = seriesData.xAxis;
        series.yAxis = this.yAxis;
        series.title = seriesData.title;
        series.brush = seriesData.brush;
        series.outline = seriesData.outline;
        series.isTransitionInEnabled = true;
        series.transitionDuration = 800;
        series.radiusX = 0;
        series.radiusY = 0;
        series.tooltipTemplate = this.columnChartTooltipTemplate;
        if (seriesData.dataSource) {
          series.dataSource = seriesData.dataSource;
        }
        this.chart.series.add(series);
      }
    } else if (this.chartData !== this.areaChartData) {
      this.chart.series.clear();
      this.chartData = this.areaChartData;
      let count = 0;
      for (const seriesData of this.areaSeriesData) {
        const series = new IgxAreaSeriesComponent();
        series.name = seriesData.name;
        series.valueMemberPath = seriesData.valueMemberPath;
        series.xAxis = this.time;
        series.yAxis = this.yAxis;
        series.brush = seriesData.color;
        series.title = (series.title as string).toUpperCase();
        series.outline = seriesData.color;
        series.isTransitionInEnabled = true;
        series.transitionDuration = 800;
        series.areaFillOpacity = 0.5;
        if (count > 0) {
          series.tooltipTemplate = this.emptyreAChartTooltipTemplate;
        }  else {
          series.tooltipTemplate = this.areaChartTooltipTemplate;
        }
        this.chart.series.add(series);
        count++;
      }
    }
    const toolTipLayer = new IgxCategoryToolTipLayerComponent();
    toolTipLayer.name = 'categorySeries';
    toolTipLayer.i.m4  = CategoryTooltipLayerPosition.InsideEnd;
    toolTipLayer.transitionDuration = 200;
    this.chart.series.add(toolTipLayer);
  }

  public setColumnSeriesData(name: string,
                             xAxis: IgxCategoryXAxisComponent,
                             valueMemberPath: string,
                             title: string,
                             brush: string,
                             outline: string,
                             dataSource?: any): IColumnSeriesData {
    if (dataSource) {
      return {
        name: name,
        xAxis: xAxis,
        valueMemberPath: valueMemberPath,
        title: title,
        brush: brush,
        outline: outline,
        dataSource: dataSource
      };
    }
    return {
      name: name,
      xAxis: xAxis,
      valueMemberPath: valueMemberPath,
      title: title,
      brush: brush,
      outline: outline
    };
  }

  public setAreaSeriesData(name: string,
                           color: string): IAreaSeriesData {
    return {
      name: name,
      valueMemberPath: name,
      title: name,
      color: color
    };
  }
}
