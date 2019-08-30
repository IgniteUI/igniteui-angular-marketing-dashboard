import { Component, OnInit, ViewChild } from '@angular/core';
import { getDateRange } from '../../app/utils';
import { DisplayDensityToken, DisplayDensity, IgxDialogComponent, ConnectedPositioningStrategy, HorizontalAlignment, VerticalAlignment,
   NoOpScrollStrategy } from 'igniteui-angular';
import { DataService } from '../data.service';
import { IRange } from '../models/range';
import { LocalizationService } from '../localization.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [{ provide: DisplayDensityToken, useValue: { displayDensity: DisplayDensity.cosy } }]
})
export class NavbarComponent implements OnInit {

  @ViewChild(IgxDialogComponent, { static: true })
  public dialog: IgxDialogComponent;

  public today = new Date();
  public startRangeBegin: Date;
  public startRangeEnd: Date;
  public endRangeBegin: Date;
  public endRangeEnd: Date;
  public version = '';
  public currentRange: IRange;
  public resources;
  public ranges;

  public overlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy({
        horizontalDirection: HorizontalAlignment.Left,
        horizontalStartPoint: HorizontalAlignment.Right,
        verticalStartPoint: VerticalAlignment.Bottom
    }),
    scrollStrategy: new NoOpScrollStrategy()
};
  constructor(private dataService: DataService, private localeService: LocalizationService) {
    // tslint:disable: max-line-length
    this.startRangeBegin = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
    this.startRangeEnd = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
    this.endRangeBegin = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
    this.endRangeEnd = this.today;
    this.resources = this.localeService.getLocale();
    this.version = window.localStorage.getItem('locale');

    this.ranges  = [
      { text: this.resources.One_week.value, selected: false, period: 'One_week'},
      { text: this.resources.One_month.value, selected: false, period: 'One_month' },
      { text: this.resources.Three_months.value, selected: false, period: 'Three_months'},
      { text: this.resources.One_year.value, selected: true, period: 'One_year' }];
  }

  public updateDates(ranges: string) {
    let dateRange: IRange;
    const current = new Date();
    let days = 0;
    const dayMiliseconds = 1000 * 60 * 60 * 24;

    switch (ranges) {
      case this.resources.One_week.value:
        dateRange = getDateRange(7);
        this.applyRanges(dateRange);
        break;
      case this.resources.One_month.value:
        current.setMonth(current.getMonth() - 1);
        days = (new Date().getTime() - current.getTime()) / dayMiliseconds;
        dateRange = getDateRange(days);
        this.applyRanges(dateRange);
        break;
      case this.resources.Three_months.value:
        current.setMonth(current.getMonth() - 3);
        days = (new Date().getTime() - current.getTime()) / dayMiliseconds;
        dateRange = getDateRange(days);
        this.applyRanges(dateRange);
        break;
      case this.resources.One_year.value:
      default:
        dateRange = getDateRange(365);
        this.applyRanges(dateRange);
        break;
    }
    this.currentRange = dateRange;
    this.dataService.getSummaryData(dateRange);
  }

  private applyRanges(ranges: IRange): void {
    this.endRangeEnd = ranges.endRangeEnd;
    this.endRangeBegin = ranges.endRangeBegin;
    this.startRangeEnd = ranges.startRangeEnd;
    this.startRangeBegin = ranges.startRangeBegin;

    const range: IRange = {
      startRangeBegin: this.startRangeBegin,
      startRangeEnd: this.startRangeEnd,
      endRangeBegin: this.endRangeBegin,
      endRangeEnd: this.endRangeEnd
    };
    this.currentRange = range;
  }

  public compareRanges(event) {
    const range: IRange = {
      startRangeBegin: this.startRangeBegin,
      startRangeEnd: this.startRangeEnd,
      endRangeBegin: this.endRangeBegin,
      endRangeEnd: this.endRangeEnd
    };
    this.currentRange = range;
    this.dataService.getSummaryData(range);
  }

  public changeLocale(version) {
    if (version !== this.version) {
      window.localStorage.setItem('locale', version);
      this.localeService.setLocale(version);
      this.dataService.getSummaryData(this.currentRange);
    }
  }

  ngOnInit() {
      this.localeService.languageLocalizer.subscribe( resources => {
        this.resources = resources;
        this.version = window.localStorage.getItem('locale');

      });

      const range: IRange = {
      startRangeBegin: this.startRangeBegin,
      startRangeEnd: this.startRangeEnd,
      endRangeBegin: this.endRangeBegin,
      endRangeEnd: this.endRangeEnd
    };
      this.currentRange = range;
      this.dataService.getSummaryData(range);

      this.dataService.onError.subscribe(err => {
      this.dialog.message = err;
      this.dialog.open();
    });
  }
}
