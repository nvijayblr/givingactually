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
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MatPaginatorIntl, useValue: customPaginatorIntl }
  ]
})
export class CategoryComponent implements OnInit {

  pageEvent: any = {};
  categoryName: any = '';
  isLoading = false;
  campaignsList = [];
  total = 0;
  page = 1;
  pageSize = 6;
  categories = [];

  isUserLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    public common: CommonService,
    private authGuardService: AuthGuardService,
    private messageService: MessageService) {
    this.categories = this.common.categories;
  }

  ngOnInit() {
    this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
    this.route.queryParams.subscribe(queryParams => {
    });

    this.route.params.subscribe(params => {
      this.page = 1;
      this.categoryName = params.categoryId;
      this.getCampainsByCategory(this.categoryName);
    });

    this.categoryName = this.route.snapshot.params.categoryId;
    if (this.categoryName) {
      this.getCampainsByCategory(this.categoryName);
    } else {
      this.getCampainsByCategory('All');
    }
  }

  getCampainsByCategory(category) {
    this.isLoading = true;
    this.http.cancelCompaignByCategoryReq();
    this.campaignsList = [];
    this.http.getCompaignByCategory(category, this.page, this.pageSize).subscribe((result: any) => {
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
    this.getCampainsByCategory(this.categoryName);
    window.scrollTo(0, 0);
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
