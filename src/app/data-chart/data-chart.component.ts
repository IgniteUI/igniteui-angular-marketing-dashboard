import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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



  public chartData: Array<IColumnChartDataRecord | IAreaChartDataRecord> = [];

  public columnChartData: Array<IColumnChartDataRecord> = [];
  public areaChartData: Array<IAreaChartDataRecord> = [];
  public prevSeriesDataSource: Array<IColumnChartDataRecord> = [];

  public columnSeries: Array<IgxColumnSeriesComponent> = [];
  public areaSeries: Array<IgxAreaSeriesComponent> = [];

  public chartInitialization = true;
  public mediumMode = false;

  constructor(private service: DataService) { }


  ngOnInit() {
    this.service.onDataFetch.subscribe((data: IRangeData) => {
      this.columnChartData = data.end.trafficStats;

      this.prevSeriesDataSource = data.start.trafficStats;

      this.areaChartData = data.end.trafficPerMedium;



      if (this.chartInitialization) {
        this.initChart();
        this.setSeries(this.mediumMode);
        this.chartInitialization = false;
      } else if (this.mediumMode) {
          this.chartData = this.areaChartData;
        } else {
          this.chartData = data.end.trafficStats;
          this.chart.actualSeries.forEach(s => {
            if (s.name === 'sessionsPrev' || s.name === 'conversionPrev') {
             s.dataSource = data.start.trafficStats;
            } else {
             s.dataSource =  data.end.trafficStats;
            }
           });
        }
    });
  }

  public setSeries(isMediumMode: boolean) {
    this.mediumMode = isMediumMode;
    if (this.mediumMode === false && this.chartData !== this.columnChartData) {
      this.chart.series.clear();
      this.chartData = this.columnChartData;
      for (const series of this.columnSeries) {
        this.chart.series.add(series);
      }
      this.addToolTipLayer();
    } else if (this.mediumMode === true && this.chartData !== this.areaChartData) {
      this.chart.series.clear();
      this.chartData = this.areaChartData;
      for (const series of this.areaSeries) {
        series.xAxis = this.time;
        this.chart.series.add(series);
      }
      this.addToolTipLayer();
    }

  }

  public setColumnSeriesData(name: string,
                             xAxis: IgxCategoryXAxisComponent,
                             valueMemberPath: string,
                             title: string,
                             brush: string,
                             outline: string,
                             dataSource?: any): IgxColumnSeriesComponent {
    const series = new IgxColumnSeriesComponent();
    series.name = name;
    series.valueMemberPath = valueMemberPath;
    series.xAxis = xAxis;
    series.yAxis = this.yAxis;
    series.title = title;
    series.brush = brush;
    series.outline = outline;
    series.isTransitionInEnabled = true;
    series.transitionDuration = 800;
    series.radiusX = 0;
    series.radiusY = 0;
    series.tooltipTemplate = this.columnChartTooltipTemplate;
    if (dataSource) {
      series.dataSource = this.prevSeriesDataSource;
      } else {
      series.dataSource = this.columnChartData;
      }
    return series;
  }

  public setAreaSeriesData(name: string,
                           color: string,
                           tooltip?: boolean): IgxAreaSeriesComponent {
    const series = new IgxAreaSeriesComponent();
    series.name = name;
    series.valueMemberPath = name;
    series.yAxis = this.yAxis;
    series.brush = color;
    series.title = (name as string).toUpperCase();
    series.outline = color;
    series.isTransitionInEnabled = true;
    series.transitionDuration = 800;
    series.areaFillOpacity = 0.5;
    if (!tooltip) {
      series.tooltipTemplate = this.emptyreAChartTooltipTemplate;
    }  else {
      series.tooltipTemplate = this.areaChartTooltipTemplate;
    }
    return series;
  }

  public addToolTipLayer() {
    const toolTipLayer = new IgxCategoryToolTipLayerComponent();
    toolTipLayer.name = 'categorySeries';
    toolTipLayer.i.m4  = CategoryTooltipLayerPosition.InsideEnd;
    toolTipLayer.transitionDuration = 200;
    this.chart.series.add(toolTipLayer);
  }

  public initChart() {
    this.columnSeries.push(this.setColumnSeriesData('sessions', this.time, 'session', 'Session', '#ffff33', '#ffff33'));
    // tslint:disable-next-line: max-line-length
    this.columnSeries.push(this.setColumnSeriesData('sessionsPrev', this.time, 'session', 'Prev.Session', '#655F00', '#655F00', true));

    this.columnSeries.push(this.setColumnSeriesData('conversion', this.timeConvers, 'conversion', 'Conversions', '#66cc00', '#66cc00'));

    // tslint:disable-next-line: max-line-length
    // tslint:disable-next-line: max-line-length
    this.columnSeries.push(this.setColumnSeriesData('conversionPrev', this.timeConvers, 'conversion', 'Prev.Conversions', '#295001', '#295001', true));

    this.areaSeries.push(this.setAreaSeriesData('organic', '#77B40D', true));
    this.areaSeries.push(this.setAreaSeriesData('paid', '#A9D120'));
    this.areaSeries.push(this.setAreaSeriesData('direct', '#CCE575'));
    this.areaSeries.push(this.setAreaSeriesData('referral', '#E1EEB5'));
    this.areaSeries.push(this.setAreaSeriesData('email', '#FFFFFF'));

  }
}
