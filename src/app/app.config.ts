import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { MockSummaryDataSource } from './data/mock-summary-data-source';
import { HttpSummaryDataSource, SummaryDataSource } from './data/summary-data-source';
import {
  provideIgxAreaSeries,
  provideIgxCategoryToolTipLayer,
  provideIgxCategoryXAxis,
  provideIgxColumnSeries,
  provideIgxDataChartCore,
  provideIgxDoughnutChart,
  provideIgxItemLegend,
  provideIgxLegend,
  provideIgxNumericYAxis,
  provideIgxRingSeries,
  provideIgxSizeScale
} from 'igniteui-angular-charts';
import { provideIgxTooltipContainerDynamic } from 'igniteui-angular-core';
import { provideIgxBulletGraph, provideIgxLinearGraphRange } from 'igniteui-angular-gauges';
import { provideIgxGeographicMap } from 'igniteui-angular-maps';

/**
 * The chart packages register internal types in a global TypeRegistrar, and
 * that registration lives in their NgModules, not the standalone components.
 * Without these the app builds but series fail at runtime on a null lookup.
 */
const igniteUiChartProviders = [
  // Chart/map tooltips; without it createTooltip() silently returns null.
  provideIgxTooltipContainerDynamic(),

  // Data chart: core, category axes, and the series created imperatively.
  provideIgxDataChartCore(),
  provideIgxCategoryXAxis(),
  provideIgxNumericYAxis(),
  provideIgxColumnSeries(),
  provideIgxAreaSeries(),
  provideIgxCategoryToolTipLayer(),
  provideIgxLegend(),

  // Campaign health: doughnut rings and their legend.
  provideIgxDoughnutChart(),
  provideIgxRingSeries(),
  provideIgxItemLegend(),
  provideIgxBulletGraph(),
  provideIgxLinearGraphRange(),

  // Sessions by region.
  provideIgxGeographicMap(),
  provideIgxSizeScale()
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Ignite UI overlays/animations still go through AnimationBuilder.
    provideAnimations(),
    provideHttpClient(withFetch()),

    // Dev generates data locally; prod/staging call the hosted endpoint.
    {
      provide: SummaryDataSource,
      useClass: environment.useMockData ? MockSummaryDataSource : HttpSummaryDataSource
    },

    ...igniteUiChartProviders
  ]
};
