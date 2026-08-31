import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import {
  CategoryTooltipLayerPosition,
  IgxAreaSeriesComponent,
  IgxCategoryToolTipLayerComponent,
  IgxCategoryXAxisComponent,
  IgxColumnSeriesComponent,
  IgxDataChartComponent,
  IgxLegendComponent,
  IgxNumericYAxisComponent
} from 'igniteui-angular-charts';
import { IgxButtonGroupComponent } from 'igniteui-angular/button-group';
import { IgxButtonDirective, IgxRippleDirective } from 'igniteui-angular/directives';
import { DataService } from '../data.service';
import { LocalizationService, ResourceKey } from '../localization.service';
import { IAreaSeriesData, IColumnSeriesData } from '../models/charts';
import { ITrafficMedium, ITrafficStat } from '../models/range';

/** Series that plot the previous period rather than the current one. */
const PREVIOUS_SERIES: ReadonlySet<string> = new Set(['PrevSession', 'PrevConversions']);

@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrl: './data-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UpperCasePipe,
    IgxButtonGroupComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxDataChartComponent,
    IgxCategoryXAxisComponent,
    IgxNumericYAxisComponent,
    IgxLegendComponent
  ]
})
export class DataChartComponent {
  private readonly service = inject(DataService);

  public readonly resources = inject(LocalizationService).resources;

  private readonly chart = viewChild(IgxDataChartComponent);
  private readonly timeAxis = viewChild<IgxCategoryXAxisComponent>('time');
  private readonly timeConversAxis = viewChild<IgxCategoryXAxisComponent>('timeConvers');
  private readonly yAxis = viewChild<IgxNumericYAxisComponent>('yAxis');

  private readonly areaTooltip = viewChild.required<TemplateRef<unknown>>('areaChartTooltipTemplate');
  private readonly emptyAreaTooltip = viewChild.required<TemplateRef<unknown>>('emptyAreaChartTooltipTemplate');
  private readonly columnTooltip = viewChild.required<TemplateRef<unknown>>('columnChartTooltipTemplate');

  /** `false` plots sessions/conversions as columns, `true` plots traffic by medium as areas. */
  public readonly mediumMode = signal(false);

  /** Bound to the chart's dataSource; the series carry their own sources on top. */
  public readonly chartData = signal<readonly (ITrafficStat | ITrafficMedium)[]>([]);

  private columnSeriesData: IColumnSeriesData[] = [];
  private areaSeriesData: IAreaSeriesData[] = [];

  private columnChartData: ITrafficStat[] = [];
  private areaChartData: ITrafficMedium[] = [];
  private prevSeriesDataSource: ITrafficStat[] = [];

  private chartInitialised = false;
  /** Which dataset the currently built series belong to. */
  private renderedMode: 'column' | 'area' | null = null;

  constructor() {
    // Rebuild or refresh the chart whenever new data lands, or the mode changes.
    effect(() => {
      const chart = this.chart();
      const yAxis = this.yAxis();
      const data = this.service.summary();
      const mediumMode = this.mediumMode();

      if (!chart || !yAxis || !data) {
        return;
      }

      this.columnChartData = data.end.trafficStats;
      this.prevSeriesDataSource = data.start.trafficStats;
      this.areaChartData = data.end.trafficPerMedium;

      if (!this.chartInitialised) {
        yAxis.formatLabel = (value: number) => (value >= 1000 ? `${value / 1000}K` : `${value}`);
        this.initChart();
        this.chartInitialised = true;
        return;
      }

      // The series set only has to be rebuilt when the mode changed.
      if ((mediumMode ? 'area' : 'column') !== this.renderedMode) {
        this.buildSeries();
        return;
      }

      this.refreshData();
    });

    // Series titles are localised, so re-label them when the locale changes.
    effect(() => {
      const chart = this.chart();
      const resources = this.resources();
      if (!chart) {
        return;
      }
      for (const series of chart.actualSeries) {
        if (series instanceof IgxColumnSeriesComponent || series instanceof IgxAreaSeriesComponent) {
          const key = series.name as ResourceKey;
          if (resources[key]) {
            series.title = resources[key].value.toUpperCase();
          }
        }
      }
    });
  }

  public setSeries(isMediumMode: boolean): void {
    this.mediumMode.set(isMediumMode);
  }

  /** Applies new data to the series already on the chart. */
  private refreshData(): void {
    const chart = this.chart();
    const yAxis = this.yAxis();
    if (!chart || !yAxis) {
      return;
    }

    if (this.mediumMode()) {
      yAxis.isLogarithmic = false;
      yAxis.title = '';
      this.chartData.set(this.areaChartData);
      return;
    }

    yAxis.title = 'LOG';
    yAxis.titleAngle = 270;
    yAxis.isLogarithmic = true;
    this.chartData.set(this.columnChartData);

    for (const series of chart.actualSeries) {
      series.dataSource = PREVIOUS_SERIES.has(series.name)
        ? this.prevSeriesDataSource
        : this.columnChartData;
    }
  }

  private buildSeries(): void {
    return this.mediumMode() ? this.buildAreaSeries() : this.buildColumnSeries();
  }

  private buildColumnSeries(): void {
    const chart = this.chart();
    const yAxis = this.yAxis();
    const timeAxis = this.timeAxis();
    if (!chart || !yAxis || !timeAxis) {
      return;
    }

    chart.series.clear();
    this.chartData.set(this.columnChartData);

    timeAxis.label = 'title';
    yAxis.title = 'LOG';
    yAxis.titleAngle = 270;
    yAxis.isLogarithmic = true;

    for (const seriesData of this.columnSeriesData) {
      const series = new IgxColumnSeriesComponent();
      series.name = seriesData.name;
      series.valueMemberPath = seriesData.valueMemberPath;
      series.xAxis = seriesData.xAxis;
      series.yAxis = yAxis;
      series.title = this.resources()[seriesData.name].value;
      series.brush = seriesData.brush;
      series.outline = seriesData.outline;
      series.isTransitionInEnabled = true;
      series.transitionDuration = 800;
      series.radiusX = 0;
      series.radiusY = 0;
      series.tooltipTemplate = this.columnTooltip();
      series.dataSource = PREVIOUS_SERIES.has(seriesData.name)
        ? this.prevSeriesDataSource
        : this.columnChartData;
      chart.series.add(series);
    }

    this.addToolTipLayer();
    this.renderedMode = 'column';
  }

  private buildAreaSeries(): void {
    const chart = this.chart();
    const yAxis = this.yAxis();
    const timeAxis = this.timeAxis();
    if (!chart || !yAxis || !timeAxis) {
      return;
    }

    chart.series.clear();
    this.chartData.set(this.areaChartData);

    yAxis.isLogarithmic = false;
    yAxis.title = '';

    this.areaSeriesData.forEach((seriesData, index) => {
      const series = new IgxAreaSeriesComponent();
      series.name = seriesData.name;
      series.valueMemberPath = seriesData.valueMemberPath;
      series.xAxis = timeAxis;
      series.yAxis = yAxis;
      series.brush = seriesData.color;
      series.outline = seriesData.color;
      series.title = this.resources()[seriesData.name].value.toUpperCase();
      series.isTransitionInEnabled = true;
      series.transitionDuration = 800;
      series.areaFillOpacity = 0.5;
      // Only the first series carries the tooltip; the rest render an empty one
      // so the shared category tooltip is not repeated per layer.
      series.tooltipTemplate = index > 0 ? this.emptyAreaTooltip() : this.areaTooltip();
      chart.series.add(series);
    });

    this.addToolTipLayer();
    this.renderedMode = 'area';
  }

  private addToolTipLayer(): void {
    const chart = this.chart();
    if (!chart) {
      return;
    }
    const toolTipLayer = new IgxCategoryToolTipLayerComponent();
    toolTipLayer.name = 'categorySeries';
    toolTipLayer.toolTipPosition = CategoryTooltipLayerPosition.InsideEnd;
    toolTipLayer.transitionDuration = 200;
    chart.series.add(toolTipLayer);
  }

  private initChart(): void {
    const timeAxis = this.timeAxis();
    const timeConversAxis = this.timeConversAxis();
    if (!timeAxis || !timeConversAxis) {
      return;
    }

    this.columnSeriesData = [
      { name: 'Sessions', xAxis: timeAxis, valueMemberPath: 'session', brush: '#ffff33', outline: '#ffff33' },
      { name: 'Conversions', xAxis: timeConversAxis, valueMemberPath: 'conversion', brush: '#66cc00', outline: '#66cc00' },
      { name: 'PrevSession', xAxis: timeAxis, valueMemberPath: 'session', brush: '#655F00', outline: '#655F00' },
      { name: 'PrevConversions', xAxis: timeConversAxis, valueMemberPath: 'conversion', brush: '#295001', outline: '#295001' }
    ];

    this.areaSeriesData = [
      { name: 'Organic', valueMemberPath: 'organic', color: '#77B40D' },
      { name: 'Paid', valueMemberPath: 'paid', color: '#A9D120' },
      { name: 'Direct', valueMemberPath: 'direct', color: '#CCE575' },
      { name: 'Referral', valueMemberPath: 'referral', color: '#E1EEB5' },
      { name: 'Email', valueMemberPath: 'email', color: '#FFFFFF' }
    ];

    this.buildSeries();
  }
}
