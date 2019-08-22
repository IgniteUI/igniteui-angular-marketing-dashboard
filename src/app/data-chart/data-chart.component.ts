import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../data.service';
import { IgxCategoryXAxisComponent } from 'igniteui-angular-charts/ES5/igx-category-x-axis-component';
import { IgxDataChartComponent } from 'igniteui-angular-charts/ES5/igx-data-chart-component';
import { IgxNumericYAxisComponent } from 'igniteui-angular-charts/ES5/igx-numeric-y-axis-component';
import { IRangeData } from '../models/range';
import { IgxColumnSeriesComponent } from 'igniteui-angular-charts/ES5/igx-column-series-component';
import { IgxAreaSeriesComponent } from 'igniteui-angular-charts/ES5/igx-area-series-component';
import { IgxCategoryToolTipLayerComponent} from 'igniteui-angular-charts/ES5/igx-category-tool-tip-layer-component';
import { RESOURCES} from '../i18n/locale-en.json';
import { JA_RESOURCES} from '../i18n/locale-ja.json';
import { IColumnSeriesData, IColumnChartDataRecord, IAreaChartDataRecord, IAreaSeriesData } from '../models/charts';
import { CategoryTooltipLayerPosition } from 'igniteui-angular-charts/ES5/CategoryTooltipLayerPosition';
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
      for (const seriesData of this.columnSeriesData) {
        const series = new IgxColumnSeriesComponent();
        series.name = seriesData.name;
        series.valueMemberPath = seriesData.valueMemberPath;
        series.xAxis = seriesData.xAxis;
        this.yAxis.isLogarithmic = true;
        this.yAxis.title = 'LOG';
        this.yAxis.titleAngle  = 270;
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
        } else {
          series.dataSource = this.columnChartData;
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
        series.title = (seriesData.title as string).toUpperCase();
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

  public addToolTipLayer() {
    const toolTipLayer = new IgxCategoryToolTipLayerComponent();
    toolTipLayer.name = 'categorySeries';
    toolTipLayer.i.m4  = CategoryTooltipLayerPosition.InsideEnd;
    toolTipLayer.transitionDuration = 200;
    this.chart.series.add(toolTipLayer);
  }

  public initChart() {
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

    this.setSeries(false);
  }
}
