import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { APP_CONFIG, AppConfig} from '@bli-shared/utils/app-config.module';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class HttpServiceService  {

  constructor(
    private http: HttpClient,
  ) { }

  private rootUrl = 'https://givingactuallyapi.azurewebsites.net/';

  private cancelCompaignsListReq$ = new Subject<void>();
  private cancelCompaignDetailsReq$ = new Subject<void>();
  private cancelCompaignByCategoryReg$ = new Subject<void>();

  getCompaignsList(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/campaign/`).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelCompaignsListReq())
    );
  }

  public cancelCompaignsListReq() {
    this.cancelCompaignsListReq$.next();
  }

  public onCancelCompaignsListReq() {
    return this.cancelCompaignsListReq$.asObservable();
  }

  getCompaignDetails(campaignId): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/campaign/${campaignId}`).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelCompaignDetailsReq())
    );
  }

  public cancelCompaignDetailsReq() {
    this.cancelCompaignDetailsReq$.next();
  }

  public onCancelCompaignDetailsReq() {
    return this.cancelCompaignDetailsReq$.asObservable();
  }


  getCompaignByCategory(category, page, pageSize): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/campaign/?Category=${category}&page=${page}&page_size=${pageSize}`).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelCompaignByCategoryReg())
    );
  }

  public cancelCompaignByCategoryReg() {
    this.cancelCompaignByCategoryReg$.next();
  }

  public onCancelCompaignByCategoryReg() {
    return this.cancelCompaignByCategoryReg$.asObservable();
  }
}
