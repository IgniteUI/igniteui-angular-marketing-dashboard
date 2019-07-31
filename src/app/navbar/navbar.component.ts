import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {dateRangeEqualize, getDateRange, IRange} from '../../app/utils';
import {DatePickerDisplayValuePipe, DatePickerInputValuePipe} from './date-picker-pipes';
import { IgxDatePickerComponent, IgxDatePipeComponent } from 'igniteui-angular';
import { IDatePicker } from 'igniteui-angular/lib/date-picker/date-picker.common';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  @ViewChildren(IgxDatePickerComponent)
  public datePickers: QueryList<IgxDatePickerComponent>;

  public datePickerPipesMap: Map<string, {displayValue: DatePickerDisplayValuePipe, inputValue: DatePickerInputValuePipe}>;
  public dateSelection: FormGroup;
  public today = new Date();
  public startRangeBegin: Date;
  public startRangeEnd: Date;
  public endRangeBegin: Date;
  public endRangeEnd: Date;

  constructor() {
    this.datePickerPipesMap = new Map();
    const arr = ['startRangeBegin', 'startRangeEnd', 'endRangeBegin', 'endRangeEnd'];
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < arr.length; index++) {
      this.datePickerPipesMap.set(arr[index],
                             {displayValue: new DatePickerDisplayValuePipe({} as IDatePicker),
                              inputValue: new DatePickerInputValuePipe({} as IDatePicker)});
    }

    this.startRangeBegin = new Date(this.today.getFullYear() - 2 , this.today.getMonth(), this.today.getDate());
    this.startRangeEnd = new Date(this.today.getFullYear() - 1 , this.today.getMonth(), this.today.getDate());
    this.endRangeBegin = new Date(this.today.getFullYear() - 1 , this.today.getMonth(), this.today.getDate());
    this.endRangeEnd = this.today;

   }

  public text1 = 'select range';
  public text2 = 'range of days';

  public ranges = [
      {text: '1 week'},
      {text: '1 month'},
      {text: '3 months'},
      {text: '1 year'}];


  public updateDates(range: string ) {
    let dateRange: IRange;
    const current = new Date();
    let days = 0;
    const dayMiliseconds = 1000 * 60 * 60 * 24;

    switch (range) {
      case '1 week':
          dateRange = getDateRange(7);
          this.applyRanges(dateRange);
          break;
      case '1 month':
          current.setMonth(current.getMonth() - 1);
          days = (new Date().getTime() - current.getTime()) / dayMiliseconds;
          dateRange = getDateRange(days);
          this.applyRanges(dateRange);
          break;
      case '3 months':
          current.setMonth(current.getMonth() - 3);
          days = (new Date().getTime() - current.getTime()) / dayMiliseconds;
          dateRange = getDateRange(days);
          this.applyRanges(dateRange);
          break;
      case '1 year':
          dateRange = getDateRange(365);
          this.applyRanges(dateRange);
          break;
}
  }

  private applyRanges(ranges: IRange): void {
      this.endRangeEnd = ranges.endRangeEnd;
      this.endRangeBegin = ranges.endRangeBegin;
      this.startRangeEnd = ranges.startRangeEnd;
      this.startRangeBegin = ranges.startRangeBegin;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.datePickers.forEach(dtp => {

      // tslint:disable-next-line: max-line-length
      this.datePickerPipesMap.set(dtp.id.substring(0, dtp.id.indexOf('-dtp')),
                                                     {
                                                      displayValue: new DatePickerDisplayValuePipe(dtp),
                                                      inputValue: new DatePickerInputValuePipe(dtp)
                                                     });

    });

  }

}
