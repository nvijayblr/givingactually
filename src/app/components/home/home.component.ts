import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from '../../services/http-service.service';
import { AuthGuardService } from '../../services/auth-guard.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  OwlOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplaySpeed: 700,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 30,
    navSpeed: 700,
    navText: [ '<i class="fa-chevron-left"></i>', '<i class="fa-chevron-right></i>"' ],
    items: 3,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
  };

  isUserLoggedIn = false;
  isLoading = true;
  campaignsList: any = [];

  constructor(
    private router: Router,
    private http: HttpService,
    private authGuardService: AuthGuardService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
    this.initHomePageCampaigns();
  }

  initHomePageCampaigns() {
    this.isLoading = true;
    this.http.cancelCompaignsListReq();
    this.http.getCompaignsList().subscribe((result: any) => {
      if (result && result.CampaignLists) {
        this.campaignsList = result.CampaignLists;
      }  else {
        this.campaignsList = [];
      }
      this.isLoading = false;
    }, (error) => {
      this.campaignsList = [];
      this.isLoading = false;
      console.log(error.statusText);
    });
  }

  startCampaing() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/ce-campaign']);
    } else {
      this.messageService.sendCommonMessage({topic: 'showLogin', reason: 'CreateCampaign'});
    }
  }

  toLocaleString(value) {
    if (value) {
      return value.toLocaleString();
    }
    return '0';
  }

}
