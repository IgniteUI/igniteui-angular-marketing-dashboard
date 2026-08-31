import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  effect,
  inject,
  viewChild
} from '@angular/core';
import {
  IgxDoughnutChartComponent,
  IgxItemLegendComponent,
  IgxRingSeriesComponent,
  IgxSliceClickEventArgs,
  LabelsPosition
} from 'igniteui-angular-charts';
import {
  IgxAlignLinearGraphLabelEventArgs,
  IgxBulletGraphComponent,
  IgxFormatLinearGraphLabelEventArgs,
  IgxLinearGraphRangeComponent
} from 'igniteui-angular-gauges';
import { DataService } from '../data.service';
import { LocalizationService, ResourceKey } from '../localization.service';
import { IBulletGraph } from '../models/bullet-graph';
import { IDoughnutColors, IDoughnutDataRecord } from '../models/doughnut-charts';
import { AdModel, IPeriodData, IRangeData } from '../models/range';
import { ITrendItem, generateTrendItem } from '../models/trend-item';
import { TrendItemComponent } from '../trend-item/trend-item.component';
import { convertToInt } from '../utils';

const DOUGHNUT_COLORS: IDoughnutColors = {
  ppc: {
    end: { value: '#ffbf00', bkg: '#5c432b', label: '#222' },
    start: { value: '#826100', bkg: '#402d32', label: '#ccc' }
  },
  email: {
    end: { value: '#ff6600', bkg: '#5c2c2b', label: '#ccc' },
    start: { value: '#732e00', bkg: '#402232', label: '#ccc' }
  },
  banners: {
    end: { value: '#4ba4aa', bkg: '#2f3c55', label: '#ccc' },
    start: { value: '#2d6165', bkg: '#2a2a47', label: '#ccc' }
  },
  thirdParty: {
    end: { value: '#f0f0f0', bkg: '#584f67', label: '#222' },
    start: { value: '#7f7f7f', bkg: '#3e334f', label: '#ccc' }
  }
};

const AD_MODELS: readonly AdModel[] = ['ppc', 'email', 'banners', 'thirdParty'];
const AD_MODEL_LABELS: Record<AdModel, ResourceKey> = {
  ppc: 'PPC',
  banners: 'Banners',
  email: 'Email',
  thirdParty: 'Third_Party'
};

const PERIODS = ['start', 'end'] as const;
type Period = (typeof PERIODS)[number];

/** `${channel}Target` is the paired target field on IPeriodData. */
const targetField = (model: AdModel) => `${model}Target` as keyof IPeriodData;

@Component({
  selector: 'app-campaign-health',
  templateUrl: './campaign-health.component.html',
  styleUrl: './campaign-health.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UpperCasePipe,
    TrendItemComponent,
    IgxDoughnutChartComponent,
    IgxItemLegendComponent,
    IgxBulletGraphComponent,
    IgxLinearGraphRangeComponent
  ]
})
export class CampaignHealthComponent {
  private readonly service = inject(DataService);

  public readonly resources = inject(LocalizationService).resources;

  private readonly chart = viewChild(IgxDoughnutChartComponent);
  private readonly legend = viewChild<TemplateRef<unknown>>('legend');

  public readonly adModels = AD_MODELS;

  public readonly trendItem = computed<ITrendItem | null>(() => {
    const data = this.service.summary();
    return data ? generateTrendItem('conversions', data, 'Conversions') : null;
  });

  public readonly doughnutData = computed<IDoughnutDataRecord[]>(() => {
    const data = this.service.summary();
    const resources = this.resources();
    if (!data) {
      return [];
    }
    // Ring order must match the colour order handed to the series.
    return (['ppc', 'banners', 'email', 'thirdParty'] as const).map(model => ({
      label: resources[AD_MODEL_LABELS[model]].value,
      value: data.end[model],
      prev: data.start[model]
    }));
  });

  /** Two graphs per channel: the previous period, then the current one. */
  public readonly bulletGraphs = computed<IBulletGraph[]>(() => {
    const data = this.service.summary();
    if (!data) {
      return [];
    }
    return AD_MODELS.flatMap(model => PERIODS.map(period => this.toBulletGraph(data, model, period)));
  });

  private chartInitialised = false;

  constructor() {
    effect(() => {
      const chart = this.chart();
      const data = this.doughnutData();
      if (!chart || data.length === 0) {
        return;
      }

      if (!this.chartInitialised) {
        this.renderDoughnutChart(chart);
        this.chartInitialised = true;
        return;
      }

      // `doughnutData` is a fresh array on every fetch, so the rings have to be
      // re-pointed at it - the original code left them on the first snapshot.
      for (const series of chart.series.toArray()) {
        series.dataSource = data;
      }
    });
  }

  public graphsFor(model: AdModel): IBulletGraph[] {
    return this.bulletGraphs().filter(graph => graph.adModel === model);
  }

  public onSliceClick(event: { args: IgxSliceClickEventArgs }): void {
    const chart = this.chart();
    if (!chart) {
      return;
    }
    const context = event.args.dataContext as IDoughnutDataRecord | undefined;
    if (context) {
      context.showLabel = event.args.isSelected;
    }
    // Reassigning the formatter is what forces the labels to re-render.
    for (const series of chart.series.toArray()) {
      series.formatLabel = this.formatSliceLabel;
    }
  }

  public getMaxValue(value: IBulletGraph['maximumValue']): number {
    return value ? convertToInt(value) : 0;
  }

  public formatLabel(args: IgxFormatLinearGraphLabelEventArgs, graph: IBulletGraph): void {
    const value = convertToInt(graph.value);
    if (args.value === 0) {
      args.label = value >= 1000 ? `${(value / 1000).toFixed(1)}K` : `${value / 1000}`;
      return;
    }
    args.label = `${Math.round(((value / args.value) * 2) * 100)}%`;
  }

  public alignLabel(args: IgxAlignLinearGraphLabelEventArgs): void {
    args.height = 0;
    args.offsetX += args.value === 0 ? 25 : -25;
  }

  private toBulletGraph(data: IRangeData, model: AdModel, period: Period): IBulletGraph {
    const periodData = data[period];
    const colors = DOUGHNUT_COLORS[model][period];
    return {
      adModel: model,
      value: periodData[model],
      maximumValue: periodData.conversions,
      target: periodData[targetField(model)] as IBulletGraph['target'],
      valueBrush: colors.value,
      bkgBrush: colors.bkg,
      labelBrush: colors.label
    };
  }

  private renderDoughnutChart(chart: IgxDoughnutChartComponent): void {
    chart.width = '120%';
    chart.height = '500px';
    chart.innerExtent = 20;
    chart.allowSliceSelection = true;
    chart.selectedSliceStrokeThickness = 7;

    const colors = AD_MODELS.map(model => DOUGHNUT_COLORS[model].end.value);
    const fadedColors = AD_MODELS.map(model => DOUGHNUT_COLORS[model].start.value);

    for (const series of this.generateSeries(colors, fadedColors)) {
      chart.series.add(series);
    }
  }

  /** Inner ring plots the previous period, outer ring the current one. */
  private generateSeries(colors: string[], fadedColors: string[]): IgxRingSeriesComponent[] {
    return [false, true].map(isCurrent => {
      const series = new IgxRingSeriesComponent();

      if (isCurrent) {
        series.brushes = colors;
        series.outlines = colors;
        series.valueMemberPath = 'value';
        series.legend = this.legend();
      } else {
        series.brushes = fadedColors;
        series.outlines = fadedColors;
        series.valueMemberPath = 'prev';
        series.radiusFactor = 0.8;
      }

      series.labelsPosition = LabelsPosition.Center;
      series.dataSource = this.doughnutData();
      series.startAngle = -90;
      series.labelMemberPath = 'label';
      series.formatLabel = this.formatSliceLabel;

      return series;
    });
  }

  /** Bound as a callback, so it must not close over `this`. */
  private readonly formatSliceLabel = (context: {
    item: IDoughnutDataRecord;
    percentValue: number;
  }): string => (context.item.showLabel ? `${Math.round(context.percentValue)}%` : '');
}
