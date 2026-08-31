import { TestBed } from '@angular/core/testing';
import { TypeRegistrar } from 'igniteui-angular-core';
import { appConfig } from './app.config';

/**
 * The chart packages register internal types in a global TypeRegistrar, and
 * that registration lives in their NgModules - never in the standalone
 * components. Importing only the components builds and type-checks fine, then
 * fails at runtime the first time a series resolves one of these types
 * (`TypeRegistrar.get(...)` returns null). Guard the registrations the
 * dashboard actually depends on.
 */
describe('appConfig chart type registrations', () => {
  const REQUIRED: Record<string, string> = {
    // Any series resolving its legend template - the data chart's column and
    // area series, and the doughnut's rings.
    LegendTemplates: 'provideIgxLegend / provideIgxItemLegend',
    // The data chart itself.
    XamDataChart: 'provideIgxDataChartCore',
    // The category tooltip layer added to the data chart.
    AnnotationLayerProxy: 'provideIgxCategoryToolTipLayer',
    // Doughnut slice selection (allowSliceSelection / sliceClick).
    InteractivityFactoryManager: 'provideIgxDoughnutChart',
    // Chart/map tooltip host. Unregistered, createTooltip() silently returns
    // null and tooltips render unstyled.
    IgxTooltipContainerComponent: 'provideIgxTooltipContainerDynamic'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...appConfig.providers] });
    // Realise the environment injector so its ENVIRONMENT_INITIALIZERs run.
    TestBed.tick();
  });

  for (const [name, provider] of Object.entries(REQUIRED)) {
    it(`registers ${name} (via ${provider})`, () => {
      expect(TypeRegistrar.get(name)).toBeTruthy();
    });
  }
});
