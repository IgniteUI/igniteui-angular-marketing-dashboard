import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
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
 * The chart/gauge/map packages register their internal types in a global
 * TypeRegistrar, and that registration lives in the NgModules - never in the
 * standalone components. Importing only the components compiles and renders
 * blank or throws at runtime (e.g. TypeRegistrar.get("LegendTemplates") is
 * null the moment a series resolves its legend template). These provideIgx*
 * functions are the standalone-app equivalent of the old NgModule imports;
 * each one composes everything its module used to bring in.
 */
const igniteUiChartProviders = [
  // Chart and map tooltips: without this, SeriesViewer.createTooltip() returns
  // null (it is guarded by TypeRegistrar.isRegistered, so it fails silently)
  // and the app's .ig-tooltip-container styling never has anything to apply to.
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
    // Zoneless is already the default on Angular v21+; this call is a no-op that
    // documents the intent and makes a re-introduced provideZoneChangeDetection() conflict.
    provideZonelessChangeDetection(),
    // Ignite UI overlays/animations still go through AnimationBuilder.
    provideAnimations(),
    provideHttpClient(withFetch()),
    ...igniteUiChartProviders
  ]
};
