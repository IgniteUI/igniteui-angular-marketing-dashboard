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
        IgxCardModule} from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrentTrendComponent } from './current-trend/current-trend.component';
import { TrendItemComponent } from './trend-item/trend-item.component';
import { DataChartComponent } from './data-chart/data-chart.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrentTrendComponent,
    TrendItemComponent,
    DataChartComponent
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
    HttpClientModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
