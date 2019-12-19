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
import { IgxNumericXAxisModule } from 'igniteui-angular-charts';
import {IgxDataChartStackedModule} from 'igniteui-angular-charts';
import { IgxFinancialChartModule } from 'igniteui-angular-charts';
import { IgxDataChartCoreModule } from 'igniteui-angular-charts';
import { IgxCategoryToolTipLayerModule } from 'igniteui-angular-charts';
import { SessionByRegionComponent } from './session-region/session-region.component';
import { IgxScatterSeriesDynamicModule} from 'igniteui-angular-charts';
import { IgxGeographicMapModule } from 'igniteui-angular-maps';
import { CampaignHealthComponent } from './campaign-health/campaign-health.component';
import { IgxDoughnutChartModule } from 'igniteui-angular-charts';
import { IgxRingSeriesModule } from 'igniteui-angular-charts';
import { IgxBulletGraphModule } from 'igniteui-angular-gauges';
import { IgxItemLegendModule } from 'igniteui-angular-charts';
import { SideNavIndicatorsComponent } from './side-nav-indicators/side-nav-indicators.component';
import { IgxLegendModule } from 'igniteui-angular-charts';
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
