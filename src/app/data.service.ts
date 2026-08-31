import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { IPeriodData, IRange, IRangeData } from './models/range';
import { Locale } from './localization.service';

/**
 * A failure carries a sequence number so that two consecutive identical
 * messages are still distinct signal values - otherwise the second one
 * would be swallowed by signal equality and the dialog would not reopen.
 */
export interface IFetchError {
  message: string;
  seq: number;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly headers = new HttpHeaders({ Accept: 'application/json' });
  private readonly endApi = environment.endApi;

  private readonly _summary = signal<IRangeData | null>(null);
  private readonly _error = signal<IFetchError | null>(null);
  private errorSeq = 0;

  /** The most recently fetched range comparison, or `null` before the first load. */
  public readonly summary = this._summary.asReadonly();

  /** The most recent fetch failure. */
  public readonly error = this._error.asReadonly();

  public getSummaryData(range: IRange, locale: Locale): void {
    const params = new HttpParams()
      .set('startRangeBegin', range.startRangeBegin.toLocaleString())
      .set('startRangeEnd', range.startRangeEnd.toLocaleString())
      .set('endRangeBegin', range.endRangeBegin.toLocaleString())
      .set('endRangeEnd', range.endRangeEnd.toLocaleString())
      .set('locale', locale);

    this.http
      .get<[IPeriodData, IPeriodData]>(this.endApi, { headers: this.headers, params })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toMessage(error))))
      .subscribe({
        next: data => {
          if (data) {
            this._summary.set({ start: data[0], end: data[1] });
          }
        },
        error: (message: string) => this._error.set({ message, seq: ++this.errorSeq })
      });
  }

  private toMessage(error: HttpErrorResponse): string {
    // A client/network failure surfaces as an ErrorEvent; anything else came back from the server.
    return error.error instanceof ErrorEvent
      ? `Error: ${error.error.message}`
      : (error.error ?? error.message);
  }
}
