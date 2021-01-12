import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { LoginSignupComponent } from './../login-signup/login-signup.component';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { AuthGuardService } from '../../services/auth-guard.service';
import { HttpService } from '../../services/http-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit, OnDestroy {
  isSticky = false;
  isHidden = false;
  prevOffset = 0;
  categories = [];
  categoryName = '';
  user: any = {};
  subscription: Subscription;
  commonSub: Subscription;
  isUserLoggedIn = false;
  isAdmin = false;
  isAdminPage = false;
  menu = '/admin/fundraisers';

  @HostListener('window:scroll')
  checkScroll() {
    const curOffset = window.pageYOffset;
    this.isSticky = curOffset >= 100;
    if (curOffset >= 300 && (curOffset > this.prevOffset)) {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }
    this.prevOffset = curOffset;
  }

  constructor(
    public dialog: MatDialog,
    public common: CommonService,
    private router: Router,
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private authGuardService: AuthGuardService,
    private socialAuthService: SocialAuthService) {
      this.categories = this.common.categories;
    }

  ngOnInit() {
    // console.log(this.categoryName, this.authGuardService.getLoggedInUserDetails());
    this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
    this.user = this.authGuardService.getLoggedInUserDetails();
    this.isAdmin = this.authGuardService.isAdmin;
    this.router.events.subscribe(params => {
      if (params instanceof NavigationEnd) {
        this.menu = params.url;
      }
      // console.log(this.router.routerState.root);
      // this.categoryName = params.categoryId;
    });
    this.subscription = this.messageService.getLoginMessage().subscribe(user => {
      this.user = user;
      console.log('this.user...', this.user)
      setTimeout(() => {
        this.isAdmin = this.authGuardService.isAdmin;
      }, 500);
    });
    this.commonSub = this.messageService.getCommonMessage().subscribe(message => {
      if (message.topic === 'logout') {
        this.doLogout();
      }
      if (message.topic === 'showLogin' ) {
        this.doLogin('create');
      }
      if (message.topic === 'categoryLoaded') {
        this.categories = this.common.categories;
      }
      if (message.topic === 'adminPage') {
        this.isAdminPage = message.isAdminPage;
      }
    });
  }

  doLogin(option) {
    const dialogRef = this.dialog.open(LoginSignupComponent, {
      width: '700px',
      panelClass: ['login-singup'],
      disableClose: true,
      data: {mode: 'login', option}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
      this.user = this.authGuardService.getLoggedInUserDetails();
    });
  }

  doLogout() {
    const userSession = this.authGuardService.getLoggedUser();
    if (userSession.isSocial) {
      this.socialAuthService.signOut();
    }
    this.user.isLoggedIn = false;
    this.isUserLoggedIn = false;
    localStorage.removeItem('ga_token');
    this.router.navigate([`/home`]);
  }

  slideMobileNav() {
    this.messageService.sendCommonMessage({topic: 'toggleMobileNav', reason: 'iconClicked'});
  }

  gotoCampaignsNearMe() {
    this.http.getGeoLocation().then(pos => {
      this.router.navigate([`/search`], {queryParams: { lat: pos.lat, lng: pos.lng }});
    });
  }

  startCampaign() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/ce-fundraiser'], {queryParams: {c: 't'}});
    } else {
      this.messageService.sendCommonMessage({topic: 'showLogin', reason: 'CreateCampaign'});
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.commonSub.unsubscribe();
  }

}
