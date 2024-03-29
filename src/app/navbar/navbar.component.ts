import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { getDateRange } from '../../app/utils';
import {
  DisplayDensityToken, DisplayDensity, IgxDialogComponent, ConnectedPositioningStrategy, HorizontalAlignment, VerticalAlignment,
  NoOpScrollStrategy,
  IgxDatePickerComponent,
  IgxCalendarComponent,
  OverlaySettings,
  IgxButtonGroupComponent
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

  @ViewChild('endRange')
  public endDatePicker: IgxDatePickerComponent;

  @ViewChild('startDialog')
  public startCalendarDialog: IgxDialogComponent;

  @ViewChild('endDialog')
  public endCalendarDialog: IgxDialogComponent;

  @ViewChild('start', {static: true})
  public startCalendar: IgxCalendarComponent;

  @ViewChild('end', {static: true})
  public endCalendar: IgxCalendarComponent;

  @ViewChild(IgxButtonGroupComponent, {static: true})
  public buttonGroup: IgxButtonGroupComponent;

  public today = new Date();
  public startRangeBegin: Date;
  public startRangeEnd: Date;
  public endRangeBegin: Date;
  public endRangeEnd: Date;

  public rangeLength: number;

  public version = '';
  public currentRange: IRange;
  public resources;
  public ranges;
  public period;

  public startRange: Date[];
  public endRange: Date[];

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
    this.startRangeBegin = new Date(this.today.getFullYear() - 2, this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
    this.startRangeEnd = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
    this.endRangeBegin = new Date(this.today.getFullYear() - 1, this.today.getMonth(), this.today.getDate(), this.today.getHours(), this.today.getMinutes(), this.today.getSeconds(), this.today.getMilliseconds());
    this.endRangeEnd = this.today;
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
      this.updateDates(this.resources['One_year'].value);
      this.buttonGroup.selectButton(3);
      this.version = version;
      if (this.startCalendar.selectedDates.length > 0) {
        this.startCalendar.deselectDate([this.startRangeBegin, this.startRangeEnd]);
      }

      if (this.endCalendar.selectedDates.length > 0 ) {
        this.endCalendar.deselectDate([this.endRangeBegin, this.endRangeEnd]);
      }
      this.dataService.getSummaryData(this.currentRange);
    }
  }

  ngOnInit() {

    this.localeService.languageLocalizer.subscribe(resources => {
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
    this.updateDates(this.resources.One_year);

    this.dataService.onError.subscribe(err => {
      this.errorDialog.message = err;
      this.errorDialog.open();
    });

    this.startCalendar.selected.subscribe((dates: Date[]) => {
      if (dates.length > 1) {

        if (dates.length >= 7) {
          const temp = new Date();
          const lastDate = dates[dates.length - 1];
          this.startRangeBegin = dates[0];
          this.startRangeEnd = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate(), temp.getHours(), temp.getMinutes(), temp.getMilliseconds());
          if (this.endRangeBegin.getTime() < this.startRangeEnd.getTime()) {
            this.endRangeBegin = new Date(this.startRangeEnd.getTime());
          }
          this.endRangeEnd = moment(this.endRangeBegin).add(dates.length - 1, 'days').toDate();
        } else {
          this.startCalendarDialog.close();
          this.errorDialog.message = 'The date range must be at least 7 days';
          this.errorDialog.open();
        }

        const btn = this.buttonGroup.buttons.find(b => b.selected);
        if (btn) {
          this.buttonGroup.deselectButton(this.buttonGroup.buttons.indexOf(btn));
        }

      } else {
        this.startRangeBegin = dates[0];
      }
    });

    this.endCalendar.selected.subscribe((dates: Date[]) => {
      if (dates.length > 1) {
        if (dates.length >= 7) {
          const temp = new Date();
          this.endRangeBegin = dates[0];
          this.endRangeEnd = new Date(dates[dates.length - 1].getFullYear(), dates[dates.length - 1].getMonth(), dates[dates.length - 1].getDate(), temp.getHours(), temp.getMinutes(), temp.getMilliseconds());
          if (this.endRangeBegin.getTime() < this.startRangeEnd.getTime()) {
            this.startRangeEnd = new Date(this.endRangeBegin.getTime());
          }
          this.startRangeBegin = moment(this.startRangeEnd).subtract(dates.length - 1, 'days').toDate();
        } else {
          this.endCalendarDialog.close();
          this.errorDialog.message = 'The date range must be at least 7 days';
          this.errorDialog.open();
        }

        const btn = this.buttonGroup.buttons.find(b => b.selected);
        if (btn) {
          this.buttonGroup.deselectButton(this.buttonGroup.buttons.indexOf(btn));
        }
      } else {
        this.endRangeBegin = dates[0];
      }
    });
  }

  public toggleStartDialog(target: HTMLElement) {
    if (this.startCalendarDialog.isOpen) {
      this.startCalendarDialog.close();
    } else {
      this.startDialogOverlaySettings.positionStrategy.settings.target = target;
      this.startCalendarDialog.open(this.startDialogOverlaySettings);

    }
  }

  public toggleEndDialog(target: HTMLElement) {
    if (this.endCalendarDialog.isOpen) {
      this.startCalendarDialog.close();
    } else {
      this.endDialogOverlaySettings.positionStrategy.settings.target = target;
      this.endCalendarDialog.open(this.endDialogOverlaySettings);
    }
  }

  public changeMonthsNumber(calendar: IgxCalendarComponent, change: number) {
    if (calendar.monthsViewNumber === 3 && change === 1) {
      return;
    }
    calendar.monthsViewNumber += change;
  }

  ngAfterViewInit() {
    this.startCalendarDialog.opening.subscribe( evt => {
      this.startCalendar.selectDate([this.startRangeBegin, this.startRangeEnd]);
      this.startCalendar.viewDate = this.startRangeEnd;
    });

    this.endCalendarDialog.opening.subscribe( evt => {
      this.endCalendar.selectDate([this.endRangeBegin, this.endRangeEnd]);
      this.endCalendar.viewDate = this.endRangeEnd;
    });

    this.startCalendarDialog.closing.subscribe(evt => {
      this.startCalendar.deselectDate([this.startRangeBegin, this.startRangeEnd]);
    });

    this.endCalendarDialog.closing.subscribe(evt => {
      this.endCalendar.deselectDate([this.endRangeBegin, this.endRangeEnd]);
    });
  }
}
