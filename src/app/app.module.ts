import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import {
  IgxNavbarModule,
  IgxButtonGroupModule,
  IgxDividerModule,
  IgxButtonModule,
  IgxDatePickerModule,
  IgxInputGroupModule,
  IgxIconModule,
  IgxMaskModule,
  IgxDialogModule,
  IgxCardModule,
  IgxProgressBarModule,
  IgxListModule, IgxRippleModule, IgxSelectModule, IgxDropDownModule, IgxToggleModule, IgxCalendarModule
} from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrentTrendComponent } from './current-trend/current-trend.component';
import { TrendItemComponent } from './trend-item/trend-item.component';
import { DataChartComponent } from './data-chart/data-chart.component';
import { IgxNumericXAxisModule } from 'igniteui-angular-charts/ES5/igx-numeric-x-axis-module';
import {IgxDataChartStackedModule} from 'igniteui-angular-charts/ES5/igx-data-chart-stacked-module';
import { IgxFinancialChartModule } from 'igniteui-angular-charts/ES5/igx-financial-chart-module';
import { IgxDataChartCoreModule } from 'igniteui-angular-charts/ES5/igx-data-chart-core-module';
import { IgxCategoryToolTipLayerModule } from 'igniteui-angular-charts/ES5/igx-category-tool-tip-layer-module';
import { SessionByRegionComponent } from './session-region/session-region.component';
import { IgxScatterSeriesDynamicModule} from 'igniteui-angular-charts/ES5/igx-scatter-series-dynamic-module';
import { IgxGeographicMapModule } from 'igniteui-angular-maps/ES5/igx-geographic-map-module';
import { CampaignHealthComponent } from './campaign-health/campaign-health.component';
import { IgxDoughnutChartModule } from 'igniteui-angular-charts/ES5/igx-doughnut-chart-module';
import { IgxRingSeriesModule } from 'igniteui-angular-charts/ES5/igx-ring-series-module';
import { IgxBulletGraphModule } from 'igniteui-angular-gauges/ES5/igx-bullet-graph-module';
import { IgxItemLegendModule } from 'igniteui-angular-charts/ES5/igx-item-legend-module';
import { SideNavIndicatorsComponent } from './side-nav-indicators/side-nav-indicators.component';
import { IgxLegendModule } from 'igniteui-angular-charts/ES5/igx-legend-module';
import { LocalizationService } from './localization.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrentTrendComponent,
    TrendItemComponent,
    DataChartComponent,
    SessionByRegionComponent,
    CampaignHealthComponent,
    SideNavIndicatorsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IgxNavbarModule,
    IgxButtonGroupModule,
    IgxDividerModule,
    IgxButtonModule,
    IgxDatePickerModule,
    IgxInputGroupModule,
    IgxIconModule,
    IgxMaskModule,
    FormsModule,
    IgxDialogModule,
    IgxCardModule,
    IgxNumericXAxisModule,
    HttpClientModule,
    IgxDataChartStackedModule,
    IgxFinancialChartModule,
    IgxDataChartCoreModule,
    IgxCategoryToolTipLayerModule,
    IgxScatterSeriesDynamicModule,
    IgxGeographicMapModule,
    IgxProgressBarModule,
    IgxDoughnutChartModule,
    IgxRingSeriesModule,
    IgxBulletGraphModule,
    IgxItemLegendModule,
    IgxLegendModule,
    IgxListModule,
    IgxRippleModule,
    IgxSelectModule,
    IgxDropDownModule,
    IgxToggleModule,
    IgxCalendarModule
  ],
  providers: [DataService, LocalizationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
