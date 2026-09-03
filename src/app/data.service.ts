import { Injectable, inject, signal } from '@angular/core';
import { SummaryDataSource } from './data/summary-data-source';
import { Locale } from './localization.service';
import { IRange, IRangeData } from './models/range';

/** `seq` keeps two identical messages distinct, so the dialog reopens. */
export interface IFetchError {
  message: string;
  seq: number;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly source = inject(SummaryDataSource);

  private readonly _summary = signal<IRangeData | null>(null);
  private readonly _error = signal<IFetchError | null>(null);
  private errorSeq = 0;

  /** The most recently fetched range comparison, or `null` before the first load. */
  public readonly summary = this._summary.asReadonly();

  /** The most recent fetch failure. */
  public readonly error = this._error.asReadonly();

  public getSummaryData(range: IRange, locale: Locale): void {
    this.source.fetch(range, locale).subscribe({
      next: data => this._summary.set(data),
      error: (message: string) => this._error.set({ message, seq: ++this.errorSeq })
    });
  }
}
