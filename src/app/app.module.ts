import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import {IgxNavbarModule, IgxButtonGroupModule, IgxDividerModule, IgxButtonModule, IgxDatePickerModule, IgxInputGroupModule, IgxIconModule} from 'igniteui-angular';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IgxNavbarModule,
    IgxButtonGroupModule,
    IgxDividerModule,
    IgxButtonModule,
    FormsModule,
    ReactiveFormsModule,
    IgxDatePickerModule,
    IgxInputGroupModule,
    IgxIconModule
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent]
})
export class AppModule {
}
