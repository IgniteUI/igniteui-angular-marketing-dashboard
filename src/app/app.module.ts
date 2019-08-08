import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import {IgxNavbarModule,
        IgxButtonGroupModule,
        IgxDividerModule,
        IgxButtonModule,
        IgxDatePickerModule,
        IgxInputGroupModule,
        IgxIconModule,
        IgxMaskModule,
        IgxDialogModule,
        IgxCardModule,
        IgxProgressBarModule} from 'igniteui-angular';
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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrentTrendComponent,
    TrendItemComponent,
    DataChartComponent,
    SessionByRegionComponent
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
    IgxProgressBarModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
