import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
import { Injectable, computed, signal } from '@angular/core';
import { RESOURCES } from './i18n/locale-en';
import { JA_RESOURCES } from './i18n/locale-ja';

// Angular ships locale data only for 'en'; an unregistered locale makes
// IgxCalendar's locale setter throw. Here rather than main.ts so tests get it.
registerLocaleData(localeJa, 'ja');

export type Locale = 'en' | 'ja';

/** The shape of a resource bundle, derived from the English one. */
export type Resources = typeof RESOURCES;
export type ResourceKey = keyof Resources;

/** Compile-time guarantee that the Japanese bundle covers every English key. */
const BUNDLES: Record<Locale, Resources> = {
  en: RESOURCES,
  ja: JA_RESOURCES
};

const STORAGE_KEY = 'locale';

const isLocale = (value: string | null): value is Locale => value === 'en' || value === 'ja';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private readonly _locale = signal<Locale>(this.readStoredLocale());

  /** The active locale. */
  public readonly locale = this._locale.asReadonly();

  /** The resource bundle for the active locale. Templates read this directly. */
  public readonly resources = computed<Resources>(() => BUNDLES[this._locale()]);

  public setLocale(locale: Locale): void {
    window.localStorage.setItem(STORAGE_KEY, locale);
    this._locale.set(locale);
  }

  private readStoredLocale(): Locale {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) {
      return stored;
    }
    window.localStorage.setItem(STORAGE_KEY, 'en');
    return 'en';
  }
}
