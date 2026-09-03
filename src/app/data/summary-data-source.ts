import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Locale } from '../localization.service';
import { IPeriodData, IRange, IRangeData } from '../models/range';

/**
 * Where the dashboard gets its numbers. Dev uses the local mock, prod/staging
 * the hosted endpoint - see `useMockData` in the environment files.
 */
@Injectable()
export abstract class SummaryDataSource {
  public abstract fetch(range: IRange, locale: Locale): Observable<IRangeData>;
}

/** Talks to the hosted summary endpoint configured in `environment.endApi`. */
@Injectable()
export class HttpSummaryDataSource extends SummaryDataSource {
  private readonly http = inject(HttpClient);
  private readonly headers = new HttpHeaders({ Accept: 'application/json' });

  public override fetch(range: IRange, locale: Locale): Observable<IRangeData> {
    const params = new HttpParams()
      .set('startRangeBegin', range.startRangeBegin.toLocaleString())
      .set('startRangeEnd', range.startRangeEnd.toLocaleString())
      .set('endRangeBegin', range.endRangeBegin.toLocaleString())
      .set('endRangeEnd', range.endRangeEnd.toLocaleString())
      .set('locale', locale);

    return this.http
      .get<[IPeriodData, IPeriodData]>(environment.endApi, { headers: this.headers, params })
      .pipe(
        map(([start, end]) => ({ start, end })),
        catchError((error: HttpErrorResponse) => throwError(() => this.toMessage(error)))
      );
  }

  private toMessage(error: HttpErrorResponse): string {
    // A client/network failure surfaces as an ErrorEvent; anything else came back from the server.
    return error.error instanceof ErrorEvent
      ? `Error: ${error.error.message}`
      : (error.error ?? error.message);
  }
}
