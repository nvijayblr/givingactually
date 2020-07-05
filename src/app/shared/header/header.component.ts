import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
    private authGuardService: AuthGuardService) {
    this.categories = this.common.categories;
  }

  ngOnInit() {
    // console.log(this.categoryName, this.authGuardService.getUserLogin());
    this.user = this.authGuardService.getUserLogin();
    this.router.events.subscribe(params => {
      // console.log(this.router.routerState.root);
      // this.categoryName = params.categoryId;
    });
    this.subscription = this.messageService.getLoginMessage().subscribe(user => {
      this.user = user;
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
    this.user.isLoggedIn = false;
    localStorage.removeItem('ga_token');
    this.router.navigate([`/home`]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
