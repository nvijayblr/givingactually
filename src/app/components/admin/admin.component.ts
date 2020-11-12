import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { AuthGuardService } from '../../services/auth-guard.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit, OnDestroy {
  commonSub: Subscription;
  isAdmin = false;

  constructor(
    private messageService: MessageService,
    private authGuardService: AuthGuardService,
    private router: Router, ) { }

  ngOnInit() {
    this.isAdmin = this.authGuardService.isAdmin;
    if (!this.isAdmin) {
      this.router.navigate([`/home`]);
      return;
    }
    this.messageService.sendCommonMessage({topic: 'adminPage', isAdminPage: true});
  }

  ngOnDestroy() {
    this.messageService.sendCommonMessage({topic: 'adminPage', isAdminPage: false});
  }

}
