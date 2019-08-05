import { Component, OnInit, ViewChild} from '@angular/core';
import {dateRangesValidator, getDateRange} from '../../app/date-utils';
import { DisplayDensityToken, DisplayDensity, IgxDialogComponent } from 'igniteui-angular';
import { DataService } from '../data.service';
import { IRange} from '../models/range'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [{ provide: DisplayDensityToken, useValue: { displayDensity: DisplayDensity.compact}}]
})
export class NavbarComponent implements OnInit {

  @ViewChild(IgxDialogComponent, {static: true})
  public dialog: IgxDialogComponent;

  public today = new Date();
  public startRangeBegin: Date;
  public startRangeEnd: Date;
  public endRangeBegin: Date;
  public endRangeEnd: Date;

  constructor(private dataService: DataService ) {

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

  public compareRanges(event) {
    const range: IRange = {
      startRangeBegin: this.startRangeBegin,
      startRangeEnd: this.startRangeEnd,
      endRangeBegin: this.endRangeBegin,
      endRangeEnd: this.endRangeEnd
    };
    this.dataService.getSummaryData(range);
  }
  ngOnInit() {

    const range: IRange = {
      startRangeBegin: this.startRangeBegin,
      startRangeEnd: this.startRangeEnd,
      endRangeBegin: this.endRangeBegin,
      endRangeEnd: this.endRangeEnd
    };
    this.dataService.getSummaryData(range);

    this.dataService.onError.subscribe(err => {
      this.dialog.message = err;
      this.dialog.open();
    });
  }
}
