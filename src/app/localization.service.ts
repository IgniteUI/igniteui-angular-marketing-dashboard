import { Injectable } from '@angular/core';
import { RESOURCES } from './i18n/locale-en.json';
import { JA_RESOURCES } from './i18n/locale-ja.json';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  public currentVersion = '';

  constructor() {
    this.currentVersion = window.localStorage.getItem('locale');
  }

  public languageLocalizer: Subject<any> = new Subject();

  public setLocale(version: string) {
    if (version === 'en') {
     this.languageLocalizer.next(RESOURCES);
     this.currentVersion = 'en';
    } else {
      this.languageLocalizer.next(JA_RESOURCES);
      this.currentVersion = 'ja';
    }
  }

  public getLocale() {
    if (this.currentVersion === 'en') {
      return RESOURCES;
    } else {
      return JA_RESOURCES;
    }
  }
}
