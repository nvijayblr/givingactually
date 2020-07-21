import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { LoginSignupComponent } from './../login-signup/login-signup.component';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { AuthGuardService } from '../../services/auth-guard.service';

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
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private authGuardService: AuthGuardService,
    private socialAuthService: SocialAuthService) {
    this.categories = this.common.categories;
  }

  ngOnInit() {
    // console.log(this.categoryName, this.authGuardService.getLoggedInUserDetails());
    this.user = this.authGuardService.getLoggedInUserDetails();
    this.router.events.subscribe(params => {
      // console.log(this.router.routerState.root);
      // this.categoryName = params.categoryId;
    });
    this.subscription = this.messageService.getLoginMessage().subscribe(user => {
      this.user = user;
    });
    this.commonSub = this.messageService.getCommonMessage().subscribe(message => {
      if (message.topic === 'logout') {
        this.doLogout();
      }
      if (message.topic === 'showLogin') {
        this.doLogin();
      }
    });
  }

  doLogin() {
    const dialogRef = this.dialog.open(LoginSignupComponent, {
      width: '700px',
      panelClass: ['login-singup'],
      disableClose: true,
      data: {mode: 'login'}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  doLogout() {
    const userSession = this.authGuardService.getLoggedUser();
    console.log(userSession);
    if (userSession.isSocial) {
      this.socialAuthService.signOut();
    }
    this.user.isLoggedIn = false;
    localStorage.removeItem('ga_token');
    this.router.navigate([`/home`]);
  }

  slideMobileNav() {
    this.messageService.sendCommonMessage({topic: 'toggleMobileNav', reason: 'iconClicked'});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.commonSub.unsubscribe();
  }

}
