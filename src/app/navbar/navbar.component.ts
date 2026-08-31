import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import {
  ConnectedPositioningStrategy,
  HorizontalAlignment,
  NoOpScrollStrategy,
  OverlaySettings,
  VerticalAlignment
} from 'igniteui-angular/core';
import {
  IgxButtonDirective,
  IgxDividerComponent,
  IgxIconButtonDirective,
  IgxRippleDirective,
  IgxToggleActionDirective
} from 'igniteui-angular/directives';
import { IgxButtonGroupComponent } from 'igniteui-angular/button-group';
import { IgxCalendarComponent } from 'igniteui-angular/calendar';
import { IGX_DIALOG_DIRECTIVES, IgxDialogComponent } from 'igniteui-angular/dialog';
import {
  ISelectionEventArgs,
  IgxDropDownComponent,
  IgxDropDownItemComponent,
  IgxDropDownItemNavigationDirective
} from 'igniteui-angular/drop-down';
import { IgxIconComponent } from 'igniteui-angular/icon';
import { IgxNavbarComponent } from 'igniteui-angular/navbar';
import { DataService } from '../data.service';
import { addDays, daysInMonth, diffInDays, isLeapYear, subtractDays, subtractMonths } from '../date-utils';
import { Locale, LocalizationService } from '../localization.service';
import { IRange } from '../models/range';
import { getDateRange } from '../utils';

/** The preset comparison windows offered by the button group. */
type RangePeriod = 'One_week' | 'One_month' | 'Three_months' | 'One_year';

const RANGES: readonly RangePeriod[] = ['One_week', 'One_month', 'Three_months', 'One_year'];
const DEFAULT_RANGE_INDEX = RANGES.indexOf('One_year');
const MIN_RANGE_DAYS = 7;

const connectedBelowLeft = (): ConnectedPositioningStrategy =>
  new ConnectedPositioningStrategy({
    horizontalDirection: HorizontalAlignment.Left,
    horizontalStartPoint: HorizontalAlignment.Right,
    verticalStartPoint: VerticalAlignment.Bottom
  });

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    IgxNavbarComponent,
    IgxButtonGroupComponent,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IgxDividerComponent,
    IgxIconComponent,
    IgxCalendarComponent,
    IgxDropDownComponent,
    IgxDropDownItemComponent,
    IgxDropDownItemNavigationDirective,
    IgxToggleActionDirective,
    IGX_DIALOG_DIRECTIVES
  ]
})
export class NavbarComponent {
  private readonly dataService = inject(DataService);
  private readonly localeService = inject(LocalizationService);
  private readonly injector = inject(Injector);

  /**
   * The only remaining view query. The button group reconciles selection
   * imperatively - it sets classes through Renderer and reads `[selected]`
   * on its buttons only at init - so its state cannot be driven by a binding.
   */
  private readonly buttonGroup = viewChild.required(IgxButtonGroupComponent);

  public readonly resources = this.localeService.resources;
  public readonly locale = this.localeService.locale;

  public readonly ranges = RANGES;
  public readonly defaultRangeIndex = DEFAULT_RANGE_INDEX;

  public readonly startRangeBegin = signal(new Date());
  public readonly startRangeEnd = signal(new Date());
  public readonly endRangeBegin = signal(new Date());
  public readonly endRangeEnd = signal(new Date());

  public readonly errorMessage = signal<string | null>(null);
  public readonly errorOpen = signal(false);

  public readonly overlaySettings: OverlaySettings = {
    positionStrategy: connectedBelowLeft(),
    scrollStrategy: new NoOpScrollStrategy()
  };

  private readonly startDialogOverlaySettings: OverlaySettings = {
    positionStrategy: connectedBelowLeft(),
    modal: false,
    scrollStrategy: new NoOpScrollStrategy()
  };

  private readonly endDialogOverlaySettings: OverlaySettings = {
    positionStrategy: connectedBelowLeft(),
    modal: false,
    closeOnOutsideClick: true,
    scrollStrategy: new NoOpScrollStrategy()
  };

  constructor() {
    this.applyRanges(getDateRange(this.daysFor('One_year')));
    this.fetch();

    // Surface fetch failures in the same dialog used for validation messages.
    effect(() => {
      const error = this.dataService.error();
      if (error) {
        this.showError(error.message);
      }
    });
  }

  public updateDates(period: RangePeriod): void {
    this.applyRanges(getDateRange(this.daysFor(period)));
    this.fetch();
  }

  public compareRanges(): void {
    this.fetch();
  }

  public changeLocale(event: ISelectionEventArgs): void {
    const locale = event.newSelection?.value as Locale | undefined;
    if (!locale || locale === this.locale()) {
      return;
    }

    this.localeService.setLocale(locale);
    this.updateDates('One_year');
    this.buttonGroup().selectButton(DEFAULT_RANGE_INDEX);
  }

  public toggleStartDialog(dialog: IgxDialogComponent, event: Event): void {
    this.toggleDialog(dialog, this.startDialogOverlaySettings, event);
  }

  public toggleEndDialog(dialog: IgxDialogComponent, event: Event): void {
    this.toggleDialog(dialog, this.endDialogOverlaySettings, event);
  }

  public changeMonthsNumber(calendar: IgxCalendarComponent, change: number): void {
    const next = calendar.monthsViewNumber + change;
    if (next < 1 || next > 3) {
      return;
    }
    calendar.monthsViewNumber = next;
  }

  /** Mirrors the stored range into the calendar as the dialog opens. */
  public onCalendarDialogOpening(calendar: IgxCalendarComponent, begin: Date, end: Date): void {
    calendar.selectDate([begin, end]);
    calendar.viewDate = end;
  }

  public onCalendarDialogClosing(calendar: IgxCalendarComponent, begin: Date, end: Date): void {
    calendar.deselectDate([begin, end]);
  }

  public onStartRangeSelected(dialog: IgxDialogComponent, dates: Date | Date[]): void {
    const selected = Array.isArray(dates) ? dates : [dates];

    if (selected.length <= 1) {
      this.startRangeBegin.set(selected[0]);
      return;
    }

    if (selected.length < MIN_RANGE_DAYS) {
      dialog.close();
      this.showError(`The date range must be at least ${MIN_RANGE_DAYS} days`);
      return;
    }

    this.startRangeBegin.set(selected[0]);
    this.startRangeEnd.set(this.atCurrentTimeOfDay(selected[selected.length - 1]));

    if (this.endRangeBegin().getTime() < this.startRangeEnd().getTime()) {
      this.endRangeBegin.set(new Date(this.startRangeEnd().getTime()));
    }
    this.endRangeEnd.set(addDays(this.endRangeBegin(), selected.length - 1));

    this.clearRangeButton();
  }

  public onEndRangeSelected(dialog: IgxDialogComponent, dates: Date | Date[]): void {
    const selected = Array.isArray(dates) ? dates : [dates];

    if (selected.length <= 1) {
      this.endRangeBegin.set(selected[0]);
      return;
    }

    if (selected.length < MIN_RANGE_DAYS) {
      dialog.close();
      this.showError(`The date range must be at least ${MIN_RANGE_DAYS} days`);
      return;
    }

    this.endRangeBegin.set(selected[0]);
    this.endRangeEnd.set(this.atCurrentTimeOfDay(selected[selected.length - 1]));

    if (this.endRangeBegin().getTime() < this.startRangeEnd().getTime()) {
      this.startRangeEnd.set(new Date(this.endRangeBegin().getTime()));
    }
    this.startRangeBegin.set(subtractDays(this.startRangeEnd(), selected.length - 1));

    this.clearRangeButton();
  }

  private toggleDialog(dialog: IgxDialogComponent, settings: OverlaySettings, event: Event): void {
    if (dialog.isOpen) {
      dialog.close();
      return;
    }
    // Since 21.2 the attach target is part of OverlaySettings, not PositionSettings.
    dialog.open({ ...settings, target: event.target as HTMLElement });

    // The overlay measures the content and positions it once, synchronously,
    // inside open() - which happens before the calendar has re-rendered with
    // the range applied by the `opening` handler. After that it only
    // recalculates on window resize, which is why the dialog could land in the
    // wrong place until the window was resized. Reposition once the DOM has
    // actually settled.
    afterNextRender(() => dialog.toggleRef.reposition(), { injector: this.injector });
  }

  private clearRangeButton(): void {
    const group = this.buttonGroup();
    const selected = group.buttons.find(button => button.selected);
    if (selected) {
      group.deselectButton(group.buttons.indexOf(selected));
    }
  }

  private showError(message: string): void {
    this.errorMessage.set(message);
    this.errorOpen.set(true);
  }

  private currentRange(): IRange {
    return {
      startRangeBegin: this.startRangeBegin(),
      startRangeEnd: this.startRangeEnd(),
      endRangeBegin: this.endRangeBegin(),
      endRangeEnd: this.endRangeEnd()
    };
  }

  private applyRanges(range: IRange): void {
    this.startRangeBegin.set(range.startRangeBegin);
    this.startRangeEnd.set(range.startRangeEnd);
    this.endRangeBegin.set(range.endRangeBegin);
    this.endRangeEnd.set(range.endRangeEnd);
  }

  private fetch(): void {
    this.dataService.getSummaryData(this.currentRange(), this.locale());
  }

  /** How many days the given preset spans, relative to today. */
  private daysFor(period: RangePeriod): number {
    const now = new Date();
    switch (period) {
      case 'One_week':
        return 7;
      case 'One_month': {
        const previousMonth = subtractMonths(now, 1);
        return daysInMonth(previousMonth.getFullYear(), previousMonth.getMonth());
      }
      case 'Three_months':
        return diffInDays(now, subtractMonths(now, 3)) + 1;
      case 'One_year':
        return isLeapYear(now.getFullYear()) ? 366 : 365;
    }
  }

  /** Ranges are date-only; carry today's clock time so comparisons stay stable. */
  private atCurrentTimeOfDay(date: Date): Date {
    const now = new Date();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getMilliseconds()
    );
  }
}
