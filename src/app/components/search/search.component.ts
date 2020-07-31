import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from '../../services/http-service.service';
import { CommonService } from '../../services/common.service';
import { MatPaginatorIntl } from '@angular/material';
import { AuthGuardService } from '../../services/auth-guard.service';
import { MessageService } from '../../services/message.service';

const customPaginatorIntl = new MatPaginatorIntl();
customPaginatorIntl.itemsPerPageLabel = 'Campaigns per page:';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MatPaginatorIntl, useValue: customPaginatorIntl }
  ]
})
export class SearchComponent implements OnInit {

  pageEvent: any = {};
  query: any = '';
  isLoading = false;
  campaignsList = [];
  total = 0;
  page = 1;
  pageSize = 6;
  isUserLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    public common: CommonService,
    private authGuardService: AuthGuardService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
    this.route.queryParams.subscribe(queryParams => {
      this.page = 1;
      this.query = queryParams.q;
      if (queryParams.lat && queryParams.lng) {
        this.initLocationSearch(queryParams.lat, queryParams.lng);
      } else {
        this.initSerach();
      }
    });
  }

  initSerach() {
    this.isLoading = true;
    this.http.cancelCompaignByCategoryReq();
    this.campaignsList = [];
    this.http.getSearchCampaigns(this.query).subscribe((result: any) => {
      this.isLoading = false;
      this.campaignsList = result.CampaignLists;
      this.total = result.TotalCampaigns;
    }, (error) => {
      this.campaignsList = [];
      this.isLoading = false;
      console.log(error.statusText);
    });
  }

  initLocationSearch(lat, lng) {
    this.isLoading = true;
    this.http.cancelCompaignByCategoryReq();
    this.campaignsList = [];
    this.http.getCampaignByLatLng(lat, lng).subscribe((result: any) => {
      this.isLoading = false;
      this.campaignsList = result.CampaignLists;
      this.total = result.TotalCampaigns;
    }, (error) => {
      this.campaignsList = [];
      this.isLoading = false;
      console.log(error.statusText);
    });
  }

  onPaginationChange(event) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.initSerach();
    window.scrollTo(0, 0);
  }

  startCampaign() {
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
