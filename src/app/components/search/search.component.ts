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
  queryString: any = '';
  isLoading = false;
  campaignsList = [];
  total = 0;
  page = 1;
  pageSize = 6;
  isUserLoggedIn = false;
  lat = '';
  lng = '';
  sortingsList = [{
    label: 'With in 100KM',
    value: '100',
    order: 'Asc'
  }, {
    label: 'With in 200KM',
    value: 'CampaignTitle'
  }, {
    label: 'With in 500KM',
    value: 'CategoryName'
  }, {
    label: 'All',
    value: '0'
  }];

  sorting = {
    label: 'With in 100KM',
    value: '100',
    order: 'Asc'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    public common: CommonService,
    private authGuardService: AuthGuardService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    console.log('init...');
    this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
    this.route.queryParams.subscribe(queryParams => {
      this.query = '';
      this.queryString = '';
      this.lat = '';
      this.lng = '';
      this.page = 1;
      this.query = queryParams.q;
      this.queryString = queryParams.q;
      if (queryParams.lat && queryParams.lng) {
        this.lat = queryParams.lat;
        this.lng = queryParams.lng;
        this.initLocationSearch(queryParams.lat, queryParams.lng, 'All');
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

  initLocationSearch(lat, lng, distance) {
    this.isLoading = true;
    this.http.cancelCompaignByCategoryReq();
    this.campaignsList = [];
    this.http.getCampaignByLatLng(lat, lng, distance).subscribe((result: any) => {
      this.isLoading = false;
      this.campaignsList = result.CampaignLists;
      this.total = result.TotalCampaigns;
    }, (error) => {
      this.campaignsList = [];
      this.isLoading = false;
      console.log(error.statusText);
    });
  }

  onSearchClick() {
    this.router.navigate(['/search'], {queryParams: {q: this.query}});
  }

  applySorting(sorting) {
    sorting.order = sorting.order === 'Asc' ? 'Desc' : 'Asc';
    this.page = 1;
    this.sorting = sorting;
    this.initLocationSearch(this.lat, this.lng, this.sorting.value);
  }

  onPaginationChange(event) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.initSerach();
    window.scrollTo(0, 0);
  }

  startCampaign() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/ce-fundraiser']);
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

  getFirstLetter(name) {
    if (name) {
      return name.substr(0, 1);
    }
    return '';
  }

}
