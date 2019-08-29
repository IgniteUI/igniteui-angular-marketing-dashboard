import { Component, OnInit } from '@angular/core';
import { LocalizationService } from './localization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'marketing-dashboard';

  constructor(private localeService: LocalizationService) {
    if (!window.localStorage.getItem('locale')) {
      window.localStorage.setItem('locale', 'en');
      this.localeService.setLocale('en');
    } else {
      this.localeService.setLocale(window.localStorage.getItem('locale'));
    }
  }
}
