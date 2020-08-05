import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { getDateRange } from '../../app/utils';
import {
  DisplayDensityToken, DisplayDensity, IgxDialogComponent, ConnectedPositioningStrategy, HorizontalAlignment, VerticalAlignment,
  NoOpScrollStrategy,
  IgxDatePickerComponent,
  IgxCalendarComponent,
  OverlaySettings,
  IgxButtonGroupComponent,
  DateRange,
  IgxDateRangePickerComponent
} from 'igniteui-angular';
import { DataService } from '../data.service';
import { IRange } from '../models/range';
import { LocalizationService } from '../localization.service';
import * as moment from 'moment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [{ provide: DisplayDensityToken, useValue: { displayDensity: DisplayDensity.cosy } }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, AfterViewInit {

  @ViewChild('errorDialog', { static: true })
  public errorDialog: IgxDialogComponent;

  @ViewChild('startRange')
  public startDatePicker: IgxDatePickerComponent;

  @ViewChild('startRangePicker', {static: true})
  public startRangePicker: IgxDateRangePickerComponent;

  @ViewChild('endRangePicker', {static: true})
  public endRangePicker: IgxDateRangePickerComponent;

  @ViewChild(IgxButtonGroupComponent, {static: true})
  public buttonGroup: IgxButtonGroupComponent;

  public today = new Date();
  public version = '';
  public startRange: DateRange;
  public endRange: DateRange;
  public currentRange: IRange;
  public startRangeMaxDate: Date;
  public endRangeMinDate: Date;
  public rangeLength: number;
  public resources;
  public ranges;
  public period;

  public overlaySettings: OverlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Left,
      horizontalStartPoint: HorizontalAlignment.Right,
      verticalStartPoint: VerticalAlignment.Bottom
    }),
    scrollStrategy: new NoOpScrollStrategy()
  };

  public startDialogOverlaySettings: OverlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Left,
      horizontalStartPoint: HorizontalAlignment.Right,
      verticalStartPoint: VerticalAlignment.Bottom
    }),
    modal: false,
    closeOnOutsideClick: true,
    scrollStrategy: new NoOpScrollStrategy()
  };

  public endDialogOverlaySettings: OverlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Left,
      horizontalStartPoint: HorizontalAlignment.Right,
      verticalStartPoint: VerticalAlignment.Bottom
    }),
    modal: false,
    closeOnOutsideClick: true,
    scrollStrategy: new NoOpScrollStrategy()
  };

  constructor(private dataService: DataService, private localeService: LocalizationService, private cdr: ChangeDetectorRef) {
    // tslint:disable: max-line-length
    const startRangeBegin = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
    const startRangeEnd = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());

    const endRangeBegin = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
    const endRangeEnd = this.today;

    this.startRange = {start: startRangeBegin, end: startRangeEnd};
    this.endRange = {start: endRangeBegin, end: endRangeEnd};

    this.startRangeMaxDate = endRangeBegin;
    this.endRangeMinDate = startRangeEnd;

    this.resources = this.localeService.getLocale();
    this.version = window.localStorage.getItem('locale');
    this.period = 'One_year';
    this.ranges = [
      { text: this.resources.One_week.value, selected: false, period: 'One_week' },
      { text: this.resources.One_month.value, selected: false, period: 'One_month' },
      { text: this.resources.Three_months.value, selected: false, period: 'Three_months' },
      { text: this.resources.One_year.value, selected: true, period: 'One_year' }];
  }

  public updateDates(rangePeriod: string) {
    let dateRange: IRange;
    const date = new Date();
    let days = 0;

    switch (rangePeriod) {
      case this.resources.One_week.value:
        dateRange = getDateRange(7);
        this.applyRanges(dateRange);
        this.period = 'One_week';
        break;
      case this.resources.One_month.value:
        date.setMonth(date.getMonth() - 1);
        days = moment(date).daysInMonth();
        dateRange = getDateRange(days);
        this.applyRanges(dateRange);
        this.period = 'One_month';
        break;
      case this.resources.Three_months.value:
        date.setMonth(date.getMonth() - 3);
        days = moment(new Date()).diff(date, 'days') + 1;
        dateRange = getDateRange(days);
        this.applyRanges(dateRange);
        this.period = 'Three_months';
        break;
      case this.resources.One_year.value:
      default:
        days = moment(date).isLeapYear() ? 366 : 365;
        dateRange = getDateRange(days);
        this.applyRanges(dateRange);
        this.period = 'One_year';
        break;
    }
    this.currentRange = dateRange;
    this.dataService.getSummaryData(dateRange);
  }

  private applyRanges(range: IRange): void {
    this.startRange = range.startRange;
    this.endRange = range.endRange;
    this.currentRange = Object.assign({}, range);
  }

  public compareRanges(event) {
    const range: IRange = {
      startRange: this.startRange,
      endRange: this.endRange
    };
    this.currentRange = range;
    this.dataService.getSummaryData(range);
  }

  public changeLocale(version) {
    if (version !== this.version) {
      window.localStorage.setItem('locale', version);
      this.localeService.setLocale(version);
      this.updateDates(this.resources['One_year'].value);
      this.buttonGroup.selectButton(3);
      this.version = version;
      this.dataService.getSummaryData(this.currentRange);
    }
  }

  ngOnInit() {

    this.localeService.languageLocalizer.subscribe(resources => {
      this.resources = resources;
      this.version = window.localStorage.getItem('locale');
    });

    const range: IRange = {
      startRange: this.startRange,
      endRange: this.endRange,
    };

    this.currentRange = range;
    this.updateDates(this.resources.One_year);

    this.dataService.onError.subscribe(err => {
      this.errorDialog.message = err;
      this.errorDialog.open();
    });

    this.startRangePicker.rangeSelected.subscribe((r: DateRange) => {
      if (r.start === r.end) {
        return;
      }
      const start = moment(r.start);
      const end = moment(r.end);
      const daysCount = end.diff(start, 'days') + 1;
      if (daysCount < 7) {
            this.startRangePicker.close();
            this.errorDialog.message = 'The date range must be at least 7 days';
            this.errorDialog.open();
            return;
      }
      let endRangeStartDate = this.endRange.start;

      if (r.end >= this.endRange.start) {
        endRangeStartDate = new Date(r.end.getTime());
      }
      const endRangeEndDate = moment(endRangeStartDate).add(daysCount - 1, 'days').toDate();
      this.endRange = {start: endRangeStartDate, end: endRangeEndDate};
      const btn = this.buttonGroup.buttons.find(b => b.selected);
      if (btn) {
        this.buttonGroup.deselectButton(this.buttonGroup.buttons.indexOf(btn));
      }
    });

    this.endRangePicker.rangeSelected.subscribe((r: DateRange) => {
      if (r.start === r.end) {
        return;
      }
      const start = moment(r.start);
      const end = moment(r.end);
      const daysCount = start.diff(end, 'days') + 1;
      if (daysCount < 7) {
        this.endRangePicker.close();
        this.errorDialog.message = 'The date range must be at least 7 days';
        this.errorDialog.open();
        return;
      }
      let startRangeEndDate = this.startRange.end;
      if (r.start < this.startRange.end) {
        startRangeEndDate = new Date(r.end.getTime());
      }
      const startRangeStartDate = moment(startRangeEndDate).subtract(daysCount - 1, 'days').toDate();
      this.startRange = {start: startRangeStartDate, end: startRangeEndDate};
      const btn = this.buttonGroup.buttons.find(b => b.selected);

      if (btn) {
        this.buttonGroup.deselectButton(this.buttonGroup.buttons.indexOf(btn));
      }

    });
  }

  public ngAfterViewInit() {
    this.endDialogOverlaySettings.positionStrategy.settings.target = this.endRangePicker.element.nativeElement;
    this.startDialogOverlaySettings.positionStrategy.settings.target = this.startRangePicker.element.nativeElement;
  }
}
