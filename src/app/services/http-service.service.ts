import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse
 } from '@angular/common/http';
// import { APP_CONFIG, AppConfig} from '@bli-shared/utils/app-config.module';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthGuardService } from './auth-guard.service';

@Injectable({ providedIn: 'root' })

export class HttpService  {

  constructor(
    private http: HttpClient,
    private authGuardService: AuthGuardService
  ) { }

  private rootUrl = 'https://givingactuallyapi.azurewebsites.net/';

  private cancelCompaignsListReq$ = new Subject<void>();
  private cancelCompaignDetailsReq$ = new Subject<void>();
  private cancelCompaignByCategoryReg$ = new Subject<void>();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('interceptor fired!');
    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
        console.log('intercept', err);
      // if (err instanceof HttpErrorResponse) {
      //   if (err.status !== 401) {
      //    return;
      //   }
      //   this.router.navigate(['login']);
      // }
    }));
  }

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
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/campaign/${campaignId}`, header).pipe(
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

  // Get Categories
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/List/Category`).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }



  // Authorized API
  signupRequest(payload): Observable<any> {
    return this.http.post<any>(`${this.rootUrl}api/register`, payload).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  loginRequest(payload): Observable<any> {
    const body = `username=${payload.username}&password=${payload.password}&grant_type=${payload.grant_type}`;
    return this.http.post<any>(`${this.rootUrl}token`, body).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  socialLoginRequest(payload): Observable<any> {
    return this.http.post<any>(`${this.rootUrl}api/Register/ExternalLogin`, payload).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  // Create Campaign


  getAuthHeaders(): any {
    const token = this.authGuardService.getToken();
    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${token}`)
      };
    return header;
  }

  createCampaignBasic(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.post<any>(`${this.rootUrl}api/campaign/Phase1`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  updateCampaignBasic(campaignId, payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.put<any>(`${this.rootUrl}api/campaign/Phase1?campaignId=${campaignId}`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  updateCampaignLocation(campaignId, payload, formData): Observable<any> {
    const header: any = this.getAuthHeaders();
    const urlParams = `campaignId=${campaignId}&placeName=${payload.placeName}&Latitude=${payload.Latitude}&Longitude=${payload.Longitude}`;
    return this.http.put<any>(`${this.rootUrl}api/campaign/Phase2?${urlParams}`, formData, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  updateCampaignDescription(campaignId, payload): Observable<any> {
    // x-www-form-urlencoded data
    const params = new HttpParams({
      fromObject: {
        campaignId,
        StoryDescription: payload.StoryDescription
      }
    });

    const token = this.authGuardService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      })
    };

    return this.http.put<any>(`${this.rootUrl}api/campaign/Phase3?campaignId=${campaignId}`, params, httpOptions).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  uploadGalleryImagesVideos(campaignId, formData): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.put<any>(`${this.rootUrl}api/campaign/Phase3Image?campaignId=${campaignId}`, formData, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  getUserCampaigns(page, pageSize): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/campaign/userCampaigns?page=${page}&page_size=${pageSize}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  // Add Like
  updateUserLike(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.post<any>(`${this.rootUrl}api/like`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  // Add Endorsement
  updateUserEndorsement(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.post<any>(`${this.rootUrl}api/Endorsements`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  // Add Endorsement
  updateUserComments(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.post<any>(`${this.rootUrl}api/comments`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  // Add Endorsement
  updateUserShares(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.post<any>(`${this.rootUrl}api/share`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

}
