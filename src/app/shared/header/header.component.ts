import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginSignupComponent } from './../login-signup/login-signup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit {
  isSticky = false;
  isHidden = false;
  prevOffset = 0;
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

  constructor(public dialog: MatDialog, ) { }

  ngOnInit() {
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

}
