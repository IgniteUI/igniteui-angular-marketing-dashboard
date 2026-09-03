import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { MockSummaryDataSource } from '../data/mock-summary-data-source';
import { SummaryDataSource } from '../data/summary-data-source';
import { NavbarComponent } from './navbar.component';
import { LocalizationService } from '../localization.service';

async function renderNavbar(): Promise<ComponentFixture<NavbarComponent>> {
  await TestBed.configureTestingModule({
    imports: [NavbarComponent],
    providers: [
      { provide: SummaryDataSource, useClass: MockSummaryDataSource },
      provideAnimations(),
      provideHttpClient(),
      provideHttpClientTesting()
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(NavbarComponent);
  await fixture.whenStable();
  return fixture;
}

describe('NavbarComponent', () => {
  afterEach(() => window.localStorage.removeItem('locale'));

  it('should create', async () => {
    const fixture = await renderNavbar();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should seed a one-year comparison range', async () => {
    const fixture = await renderNavbar();
    const component = fixture.componentInstance;
    const days =
      (component.endRangeEnd().getTime() - component.endRangeBegin().getTime()) / 86_400_000;
    expect(Math.round(days)).toBeGreaterThanOrEqual(364);
  });

  /**
   * An unregistered locale makes IgxCalendar's setter throw, killing the whole
   * change-detection pass. Guard every locale the switcher can select.
   */
  describe('calendar locales', () => {
    for (const locale of ['en', 'ja']) {
      it(`resolves Angular locale data for "${locale}"`, () => {
        expect(() => getLocaleFirstDayOfWeek(locale)).not.toThrow();
      });
    }

    it('renders the calendars under a non-English locale', async () => {
      window.localStorage.setItem('locale', 'ja');
      const fixture = await renderNavbar();

      expect(TestBed.inject(LocalizationService).locale()).toBe('ja');
      // A throw in the calendar's locale setter would have surfaced here.
      expect(fixture.componentInstance).toBeTruthy();
    });
  });
});
