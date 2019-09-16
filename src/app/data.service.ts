import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observer, BehaviorSubject, AsyncSubject, Subject } from 'rxjs';
import { IRange, IRangeData } from './models/range';


@Injectable({
  providedIn: 'root'
})
export class DataService {


  public summaryData: IRangeData;
  public headers: HttpHeaders;
  public onDataFetch: Subject<any> = new Subject();
  public onError: EventEmitter<string> = new EventEmitter();
  private dataObserver: Observer<any>;

  private endApi = environment.endApi;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      Accept: 'application/json'
    });

    this.dataObserver = {
      next: (data) => {
        if (data) {
          this.summaryData = {start: data[0], end: data[1]};
          this.onDataFetch.next(this.summaryData);
        }
      },
      error: (err) => this.onError.emit(err),
      complete: () => {}
    };
  }


  public getSummaryData(range: IRange) {
      const params = new HttpParams().
      set('startRangeBegin', range.startRangeBegin.toUTCString().replace('UTC', 'GMT')).
      set('startRangeEnd', range.startRangeEnd.toUTCString().replace('UTC', 'GMT')).
      set('endRangeBegin', range.endRangeBegin.toUTCString().replace('UTC', 'GMT')).
      set('endRangeEnd', range.endRangeEnd.toUTCString().replace('UTC', 'GMT')).
      set('locale', window.localStorage.getItem('locale'));

      this.http.get(this.endApi, { headers: this.headers, params }).pipe(catchError(this.handleError)).subscribe(this.dataObserver);
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = error.error;
    }
    return throwError(errorMessage);
  }
}
