import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  TemplateRef,
  computed,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { IgxSeriesComponent, IgxSizeScaleComponent, MarkerType } from 'igniteui-angular-charts';
import { Visibility } from 'igniteui-angular-core';
import {
  IgxGeographicMapComponent,
  IgxGeographicMapImagery,
  IgxGeographicProportionalSymbolSeriesComponent,
  IgxGeographicShapeSeriesComponent
} from 'igniteui-angular-maps';
import { IgxButtonDirective, IgxDividerComponent, IgxRippleDirective } from 'igniteui-angular/directives';
import { IgxIconComponent } from 'igniteui-angular/icon';
import { IgxLinearProgressBarComponent } from 'igniteui-angular/progressbar';
import { DataService } from '../data.service';
import { LocalizationService } from '../localization.service';
import { IGeographicProportionalSymbolSeries, IGeographicShapeSeries } from '../models/map';
import { ILocationStat } from '../models/range';

const SHAPE_SERIES: IGeographicShapeSeries = {
  name: 'world',
  shapeDataSource: './assets/world.shp',
  databaseSource: './assets/world.dbf',
  brush: '#6F6B75',
  outline: '#67626E'
};

const SYMBOL_SERIES: IGeographicProportionalSymbolSeries = {
  name: 'countryTraffic',
  latitudeMemberPath: 'latitude',
  longitudeMemberPath: 'longitude',
  markerType: MarkerType.Circle,
  radiusMemberPath: 'scaledSessions',
  markerOutline: '#000',
  markerBrush: '#ffff33'
};

const PLAYBACK_INTERVAL_MS = 1000;

@Component({
  selector: 'app-session-region',
  templateUrl: './session-region.component.html',
  styleUrl: './session-region.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IgxGeographicMapComponent,
    IgxLinearProgressBarComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxDividerComponent,
    IgxIconComponent
  ]
})
export class SessionByRegionComponent implements AfterViewInit {
  private readonly service = inject(DataService);

  public readonly resources = inject(LocalizationService).resources;

  private readonly map = viewChild(IgxGeographicMapComponent);
  private readonly tooltipTemplate = viewChild.required<TemplateRef<unknown>>('template');

  public readonly users = computed(() => this.service.summary()?.end.users ?? '');
  public readonly conversionRate = computed(() => this.service.summary()?.end.conversionRate ?? '');
  public readonly topPages = computed(() => this.service.summary()?.end.topPages ?? []);

  /** Highest index of the traffic-over-time playback, i.e. the progress bar max. */
  public readonly range = computed(() =>
    Math.max(this.service.summary()?.end.trafficStats.length ?? 1, 1) - 1
  );

  public readonly inProgressMode = signal(false);

  /** Bound into the progress bar, so the interval tick still updates the UI. */
  public readonly progress = signal(0);

  private intervalId: number | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopPlayback());

    // Safe before the series exist: series attached later get this dataSource.
    effect(() => {
      const map = this.map();
      const data = this.service.summary();
      if (!map || !data) {
        return;
      }

      this.stopPlayback();
      this.inProgressMode.set(false);
      this.progress.set(0);
      map.dataSource = data.end.trafficStats[0]?.perLocation ?? [];
    });
  }

  /**
   * Not in the data effect: the map builds its series adapter in its own
   * ngAfterContentInit, and adding a series before that throws.
   */
  public ngAfterViewInit(): void {
    const map = this.map();
    if (map) {
      this.configureMap(map);
    }
  }

  public toggleUpdate(): void {
    if (this.inProgressMode()) {
      this.stopPlayback();
      this.inProgressMode.set(false);
      return;
    }

    this.inProgressMode.set(true);
    this.intervalId = window.setInterval(() => this.tick(), PLAYBACK_INTERVAL_MS);
  }

  private tick(): void {
    const stats = this.service.summary()?.end.trafficStats;
    if (!stats?.length) {
      return;
    }

    const next = (this.progress() + 1) % stats.length;
    this.progress.set(next);
    this.applyLocations(stats[next].perLocation);
  }

  /** Playback mutates the bound array in place and notifies the map per item. */
  private applyLocations(source: ILocationStat[]): void {
    const map = this.map();
    const target = this.service.summary()?.end.trafficStats[0]?.perLocation;
    if (!map || !target) {
      return;
    }

    for (let i = 0; i < target.length && i < source.length; i++) {
      const previous = { ...target[i] };
      target[i].scaledSessions = source[i].scaledSessions;
      target[i].session = source[i].session;
      map.notifySetItem(target, i, previous, target[i]);
    }
  }

  private stopPlayback(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private configureMap(map: IgxGeographicMapComponent): void {
    map.width = '100%';
    map.height = '450px';
    map.zoomable = false;
    map.windowRect = { left: 0, top: 0, height: 0.7, width: 0.7 };
    map.crosshairVisibility = Visibility.Collapsed;
    // The typings declare this non-nullable, but null is what clears the
    // default background imagery - which is the look this dashboard wants.
    map.backgroundContent = null as unknown as IgxGeographicMapImagery;

    for (const series of this.buildSeries()) {
      map.series.add(series);
    }
  }

  private buildSeries(): IgxSeriesComponent[] {
    const shapeSeries = new IgxGeographicShapeSeriesComponent();
    shapeSeries.name = SHAPE_SERIES.name;
    shapeSeries.shapeDataSource = SHAPE_SERIES.shapeDataSource;
    shapeSeries.databaseSource = SHAPE_SERIES.databaseSource;
    shapeSeries.brush = SHAPE_SERIES.brush;
    shapeSeries.outline = SHAPE_SERIES.outline;

    const sizeScale = new IgxSizeScaleComponent();
    sizeScale.minimumValue = 4;
    sizeScale.maximumValue = 60;

    const symbolSeries = new IgxGeographicProportionalSymbolSeriesComponent();
    symbolSeries.radiusScale = sizeScale;
    symbolSeries.name = SYMBOL_SERIES.name;
    symbolSeries.latitudeMemberPath = SYMBOL_SERIES.latitudeMemberPath;
    symbolSeries.longitudeMemberPath = SYMBOL_SERIES.longitudeMemberPath;
    symbolSeries.markerType = SYMBOL_SERIES.markerType;
    symbolSeries.radiusMemberPath = SYMBOL_SERIES.radiusMemberPath;
    symbolSeries.markerOutline = SYMBOL_SERIES.markerOutline;
    symbolSeries.markerBrush = SYMBOL_SERIES.markerBrush;
    symbolSeries.tooltipTemplate = this.tooltipTemplate();

    return [shapeSeries, symbolSeries];
  }
}
