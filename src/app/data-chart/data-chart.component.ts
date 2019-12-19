import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { IgxCategoryXAxisComponent } from 'igniteui-angular-charts';
import { IgxDataChartComponent } from 'igniteui-angular-charts';
import { IgxNumericYAxisComponent } from 'igniteui-angular-charts';
import { IRangeData } from '../models/range';
import { IgxColumnSeriesComponent } from 'igniteui-angular-charts';
import { IgxAreaSeriesComponent } from 'igniteui-angular-charts';
import { IgxCategoryToolTipLayerComponent} from 'igniteui-angular-charts';
import { RESOURCES} from '../i18n/locale-en.json';
import { JA_RESOURCES} from '../i18n/locale-ja.json';
import { IColumnSeriesData, IColumnChartDataRecord, IAreaChartDataRecord, IAreaSeriesData } from '../models/charts';
import { CategoryTooltipLayerPosition } from 'igniteui-angular-charts';
import { LocalizationService } from '../localization.service';
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
  public chartLabelFormatter;
  public mediumMode = false;
  public chartInitialization = true;

  public resources: typeof RESOURCES | typeof JA_RESOURCES;

  constructor(private service: DataService, private localeService: LocalizationService) {
    this.resources = this.localeService.getLocale();
  }


  ngOnInit() {

    this.localeService.languageLocalizer.subscribe( (resources: typeof RESOURCES | typeof JA_RESOURCES )  => {
      this.resources = resources;
      this.changeChartSeriesTitle();
    });
    this.service.onDataFetch.subscribe((data: IRangeData) => {

      this.columnChartData = data.end.trafficStats;

      this.prevSeriesDataSource = data.start.trafficStats;

      this.areaChartData = data.end.trafficPerMedium;


      if (this.chartInitialization) {
        this.initChart();
        this.yAxis.formatLabel = (value) => {
          let label = value;
          if (value >= 1000) { label = `${(value / 1000)}K`; }
          return label;
        };
        this.chartInitialization = false;
      } else if (this.mediumMode) {
          this.yAxis.isLogarithmic = false;
          this.yAxis.title = '';
          this.chartData = this.areaChartData;
        } else {
          this.yAxis.title = 'LOG';
          this.yAxis.titleAngle = 270;
          this.yAxis.isLogarithmic = true;
          this.chartData = data.end.trafficStats;
          this.chart.actualSeries.forEach(s => {
            if (s.name === 'PrevSession' || s.name === 'PrevConversions') {
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
      for (const seriesData of this.columnSeriesData) {
        const series = new IgxColumnSeriesComponent();
        series.name = seriesData.name;
        series.valueMemberPath = seriesData.valueMemberPath;
        series.xAxis = seriesData.xAxis;
        this.time.label = 'title';
        this.yAxis.title = 'LOG';
        this.yAxis.titleAngle = 270;
        this.yAxis.isLogarithmic = true;
        series.yAxis = this.yAxis;
        series.title = this.resources[seriesData.name].value;
        series.brush = seriesData.brush;
        series.outline = seriesData.outline;
        series.isTransitionInEnabled = true;
        series.transitionDuration = 800;
        series.radiusX = 0;
        series.radiusY = 0;
        series.tooltipTemplate = this.columnChartTooltipTemplate;
        if (seriesData.name === 'PrevSession' || seriesData.name === 'PrevConversions') {
          series.dataSource = this.prevSeriesDataSource;
         } else {
          series.dataSource =  this.columnChartData;
         }
        this.chart.series.add(series);
      }
      this.addToolTipLayer();
    } else if (this.mediumMode === true && this.chartData !== this.areaChartData) {
      this.chart.series.clear();
      this.chartData = this.areaChartData;
      let count = 0;
      for (const seriesData of this.areaSeriesData) {
        const series = new IgxAreaSeriesComponent();
        series.name = seriesData.name;
        series.valueMemberPath = seriesData.valueMemberPath;
        series.xAxis = this.time;
        this.yAxis.isLogarithmic = false;
        this.yAxis.title = '';
        series.yAxis = this.yAxis;
        series.brush = seriesData.color;
        series.title = (this.resources[seriesData.name].value as string).toUpperCase();
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
      this.addToolTipLayer();
    }
  }

  public setColumnSeriesData(name: string,
                             xAxis: IgxCategoryXAxisComponent,
                             valueMemberPath: string,
                             brush: string,
                             outline: string,
                             dataSource?: any): IColumnSeriesData {
    if (dataSource) {
      return {
        name: name,
        xAxis: xAxis,
        valueMemberPath: valueMemberPath,
        brush: brush,
        outline: outline,
        dataSource: dataSource
      };
    }
    return {
      name: name,
      xAxis: xAxis,
      valueMemberPath: valueMemberPath,
      brush: brush,
      outline: outline
    };
  }

  public setAreaSeriesData(name: string,
                           valueMemberPath: string,
                           color: string): IAreaSeriesData {
    return {
      name: name,
      valueMemberPath: valueMemberPath,
      color: color
    };
  }

  public addToolTipLayer() {
    const toolTipLayer = new IgxCategoryToolTipLayerComponent();
    toolTipLayer.name = 'categorySeries';
    toolTipLayer.i.m5  = CategoryTooltipLayerPosition.InsideEnd;
    toolTipLayer.transitionDuration = 200;
    this.chart.series.add(toolTipLayer);
  }

  public initChart() {
    // tslint:disable: max-line-length
    this.columnSeriesData.push(this.setColumnSeriesData('Sessions', this.time, 'session', '#ffff33', '#ffff33'));
    this.columnSeriesData.push(this.setColumnSeriesData('Conversions', this.timeConvers, 'conversion', '#66cc00', '#66cc00'));

    this.columnSeriesData.push(this.setColumnSeriesData('PrevSession', this.time, 'session',  '#655F00', '#655F00', this.prevSeriesDataSource));
    this.columnSeriesData.push(this.setColumnSeriesData('PrevConversions', this.timeConvers, 'conversion', '#295001', '#295001', this.prevSeriesDataSource));

    this.areaSeriesData.push(this.setAreaSeriesData('Organic', 'organic', '#77B40D'));
    this.areaSeriesData.push(this.setAreaSeriesData('Paid', 'paid', '#A9D120'));
    this.areaSeriesData.push(this.setAreaSeriesData('Direct', 'direct', '#CCE575'));
    this.areaSeriesData.push(this.setAreaSeriesData('Referral', 'referral', '#E1EEB5'));
    this.areaSeriesData.push(this.setAreaSeriesData('Email', 'email', '#FFFFFF'));

    this.setSeries(false);
  }

  public changeChartSeriesTitle() {
      this.chart.actualSeries.forEach( s => {
        if ( s instanceof IgxColumnSeriesComponent || s instanceof IgxAreaSeriesComponent) {
          s.title = this.resources[s.name].value.toUpperCase();
        }
      });
  }
}
