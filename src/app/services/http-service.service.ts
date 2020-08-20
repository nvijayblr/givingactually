import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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

  private rootUrl = 'https://developement.givingactually.com/';

  private cancelCompaignsListReq$ = new Subject<void>();
  private cancelCompaignDetailsReq$ = new Subject<void>();
  private cancelCompaignByCategoryReq$ = new Subject<void>();
  private cancelSearchReq$ = new Subject<void>();

  getTopCompaignsList(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/Campaign/TopCampaigns/`).pipe(
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


  getCompaignByCategory(category, page, pageSize, sortBy, order): Observable<any> {
    return this.http.get<any>(
      `${this.rootUrl}api/campaign/?Category=${category}&page=${page}&page_size=${pageSize}&SortBy=${sortBy}&order=${order}`
      ).pipe(tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelCompaignByCategoryReq())
    );
  }

  public cancelCompaignByCategoryReq() {
    this.cancelCompaignByCategoryReq$.next();
  }

  public onCancelCompaignByCategoryReq() {
    return this.cancelCompaignByCategoryReq$.asObservable();
  }

  getSearchCampaigns(query): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/Campaign/SearchCampaigns/?SearchText=${query}`).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelSearchReq())
    );
  }

  public cancelSearchReq() {
    this.cancelSearchReq$.next();
  }

  public onCancelSearchReq() {
    return this.cancelSearchReq$.asObservable();
  }

  getCampaignByLatLng(Lat, Lon): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any>(`${this.rootUrl}api/campaign?Category=All&page=1&page_size=6&SortBy=Distance&order=Asc&Lat=${Lat}&Lon=${Lon}`).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelSearchReq())
    );
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

  // Get NGO Types
  getNGOTypes(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/List/NGOTypes`).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  // Get NGO Sectors
  getNGOSectors(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/List/NGOSectors`).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }


  // Get Beneficiary Type
  getBeneficiaryType(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/List/BeneficiaryType`).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  // Get Money Type
  getMoneyType(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/List/MoneyType`).pipe(
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

  validateOTP(payload): Observable<any> {
    return this.http.post<any>(`${this.rootUrl}api/Register/CheckOTP`, payload).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  resendOTP(username): Observable<any> {
    return this.http.post<any>(`${this.rootUrl}api/Register/ResendOTP?UserName=${username}`, {}).pipe(
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
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //     Authorization: `Bearer ${token}`
    //   })
    // };
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

    return this.http.put<any>(`${this.rootUrl}api/campaign/Phase3/?campaignId=${campaignId}`, params, httpOptions).pipe(
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

  // Campaing Updates

  updateCampaignUpdates(campaignId, payload): Observable<any> {
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

    return this.http.put<any>(`${this.rootUrl}api/campaign/Update?campaignId=${campaignId}`, params, httpOptions).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  uploadCampaignUpdatesImagesVideos(campaignId, updateId, formData): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.put<any>(
      `${this.rootUrl}api/campaign/UpdateImage?campaignId=${campaignId}&updateId=${updateId}`, formData, header).pipe(
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

  // Get user details
  getUserDetails(userId): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/User/${userId}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  updateUserPersonalDetails(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.put<any>(`${this.rootUrl}api/User`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  // Payment (Donation)
  registerDonation(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.post<any>(`${this.rootUrl}api/Donation`, payload).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  confirmPaymentSuccess(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.post<any>(`${this.rootUrl}api/Donation/Charge`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  getGeoLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
      },
      err => {
        reject(err);
      });
    });
  }

  getBankAccountDetails(campaignId): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/campaign/BankDetail?campaignId=${campaignId}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  createBankAccount(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.post<any>(`${this.rootUrl}api/Campaign/CampaignBank`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  updateBankAccount(payload): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.put<any>(`${this.rootUrl}api/Campaign/CampaignBank`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  createWithdraw(payload): Observable<any> {
    const params = new HttpParams({
      fromObject: payload
    });

    const token = this.authGuardService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      })
    };

    return this.http.post<any>(`${this.rootUrl}api/Campaign/Withdraw`, params, httpOptions).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  getWithdrawHistory(campaignId): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/WithdrawHistory?CampaignId=${campaignId}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }



}
