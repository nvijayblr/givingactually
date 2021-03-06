import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthGuardService } from './auth-guard.service';
// import * as env from './../../assets/config/env.json';

@Injectable({ providedIn: 'root' })

export class HttpService  {

  private rootUrl = 'https://developement.givingactually.com/';
  private prodUrl = 'https://productionapi.givingactually.com/';

  constructor(
    private http: HttpClient,
    private authGuardService: AuthGuardService
  ) {
    // const baseUrl = (env as any).default.baseUrl;
    // if (baseUrl) {
    //   this.rootUrl = baseUrl;
    // }
    // tslint:disable-next-line: max-line-length
    if (window && (window.location.origin === 'https://www.givingactually.com' || window.location.origin === 'https://givingactually.com')) {
      this.rootUrl = this.prodUrl;
    }
  }


  private cancelCompaignsListReq$ = new Subject<void>();
  private cancelCompaignDetailsReq$ = new Subject<void>();
  private cancelCompaignByCategoryReq$ = new Subject<void>();
  private cancelSearchReq$ = new Subject<void>();
  private cancelAdminCompaignsListReq$ = new Subject<void>();
  private cancelAdminUsersListReq$ = new Subject<void>();
  private cancelAdminBankAccountsListReq$ = new Subject<void>();
  private cancelAdminWithdrawalsListReq$ = new Subject<void>();

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

  getSearchCampaigns(query, page, pageSize): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}api/Campaign/SearchCampaigns/?SearchText=${query}&page=${page}&page_size=${pageSize}`).pipe(
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

  getCampaignByLatLng(Lat, Lon, Distance, page, pageSize): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.get<any>(`${this.rootUrl}api/campaign?Category=All&page=${page}&page_size=${pageSize}&SortBy=Distance&order=Asc&Lat=${Lat}&Lon=${Lon}&Distance=${Distance}`).pipe(
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


  getUserCampaigns(userId, page, pageSize): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/campaign/userCampaigns?UserId=${userId}&page=${page}&page_size=${pageSize}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  getUserStatistics(userId): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/Campaign/UserStatistics?UserId=${userId}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  getUserDonations(): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/Campaign/UserDonations`, header).pipe(
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

  uploadProfilePicutre(formdata): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.post<any>(`${this.rootUrl}api/User/UploadDisplayPic`, formdata, header).pipe(
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
    return this.http.get<any>(`${this.rootUrl}api/Campaign/WithdrawHistory?CampaignId=${campaignId}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
    );
  }

  getCompaignSummary(campaignId): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/Campaign/CampaignSummary?id=${campaignId}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelCompaignDetailsReq())
    );
  }

  // Admin related APIs
  adminGetCampaigns(type): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/Admin/${type}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelAdminCompaignsListReq())
    );
  }

  public cancelAdminCompaignsListReq() {
    this.cancelAdminCompaignsListReq$.next();
  }

  public onCancelAdminCompaignsListReq() {
    return this.cancelAdminCompaignsListReq$.asObservable();
  }

  approveCampaign(campaignId): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/Admin/ApproveCampaign?CampaignId=${campaignId}`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelCompaignDetailsReq())
    );
  }


  adminGetUsersList(): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/Admin/GetUsers`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelAdminUsersListReq())
    );
  }

  public cancelAdminUsersListReq() {
    this.cancelAdminUsersListReq$.next();
  }

  public onCancelAdminUsersListReq() {
    return this.cancelAdminUsersListReq$.asObservable();
  }

  adminBankAccountsList(): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/Admin/BankDetailForApproval`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelAdminBankAccountsListReq())
    );
  }

  public cancelAdminBankAccountsListReq() {
    this.cancelAdminBankAccountsListReq$.next();
  }

  public onCancelAdminBankAccountsListReq() {
    return this.cancelAdminBankAccountsListReq$.asObservable();
  }

  approveRejectBankAccount(payload, action): Observable<any> {
    const header: any = this.getAuthHeaders();
    // tslint:disable-next-line: max-line-length
    return this.http.post<any>(`${this.rootUrl}api/Admin/${action === 'approve' ? 'ApproveBank' : 'RejectBank'}`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelCompaignDetailsReq())
    );
  }

  adminWithdrawalsListList(): Observable<any> {
    const header: any = this.getAuthHeaders();
    return this.http.get<any>(`${this.rootUrl}api/Admin/WithdrawalListForApproval`, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelAdminWithdrawalsListReq())
    );
  }

  public cancelAdminWithdrawalsListReq() {
    this.cancelAdminWithdrawalsListReq$.next();
  }

  public onCancelAdminWithdrawalsListReq() {
    return this.cancelAdminWithdrawalsListReq$.asObservable();
  }

  approveRejectWithdrawalRequest(payload, action): Observable<any> {
    const header: any = this.getAuthHeaders();
    // tslint:disable-next-line: max-line-length
    return this.http.post<any>(`${this.rootUrl}api/Admin/${action === 'approve' ? 'ApproveWithdraw' : 'RejectWithdraw'}`, payload, header).pipe(
      tap((res) => {
      }),
      catchError(err => {
        return throwError(err);
      }),
      takeUntil(this.onCancelCompaignDetailsReq())
    );
  }



}
