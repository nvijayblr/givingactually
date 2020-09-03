import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from '../../services/http-service.service';
import { CommonService } from '../../services/common.service';
import { MatPaginatorIntl } from '@angular/material';
import { AuthGuardService } from '../../services/auth-guard.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';

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
export class CategoryComponent implements OnInit, OnDestroy {
  @ViewChild('owlCar', {static: true}) owlCar;

  pageEvent: any = {};
  categoryName: any = '';
  isLoading = false;
  campaignsList = [];
  total = 0;
  page = 1;
  pageSize = 6;
  categories = [];
  sortingsList = [{
    label: 'Latest',
    value: 'CreatedOn',
    order: 'Asc'
  }, {
    label: 'Title',
    value: 'CampaignTitle'
  }, {
    label: 'Category',
    value: 'CategoryName'
  }, {
    label: 'Location',
    value: 'placeName'
  }, {
    label: 'Goal Amount',
    value: 'CampaignTargetMoney'
  }, {
    label: 'Funded Amount',
    value: 'RaisedAmount'
  }, {
    label: 'Days Left',
    value: 'DaysLeft'
  }, {
    label: 'Supporters',
    value: 'Totalsupporters'
  }];

  sorting = {
    label: 'Latest',
    value: 'CreatedOn',
    order: 'Asc'
  };


  // Category List
  categoryList = [{
    title: 'All',
    icon: 'fa-globe',
    key: 'All',
    id: 'All'
  }, {
    title: 'Agriculture',
    icon: 'fa-tree',
    key: 'Agriculture',
    id: 'Agriculture'
  }, {
    title: 'Animals',
    icon: 'fa-paw',
    key: 'Animals',
    id: 'Animals'
  }, {
    title: 'Annadhanam',
    icon: 'fa-sun-o',
    key: 'Annadhanam',
    id: 'Annadhanam'
  }, {
    title: 'Charity',
    icon: 'fa-venus',
    key: 'Charity',
    id: 'Charity'
  }, {
    title: 'Education',
    icon: 'fa-book',
    key: 'Education',
    id: 'Education'
  }, {
    title: 'Elderly Care',
    icon: 'fa-blind',
    key: 'Elderly Care',
    id: 'ElderlyCare'
  }, {
    title: 'Emergency',
    icon: 'fa-ambulance',
    key: 'Emergency',
    id: 'Emergency'
  }, {
    title: 'Funeral',
    icon: 'fa-life-ring',
    key: 'Funeral',
    id: 'Funeral'
  }, {
    title: 'Medical',
    icon: 'fa-heartbeat',
    key: 'Medical',
    id: 'Medical'
  }, {
    title: 'Nutrition',
    icon: 'fa-cutlery',
    key: 'Nutrition',
    id: 'Nutrition'
  }, {
    title: 'Spirituality',
    icon: 'fa-circle-o-notch',
    key: 'Spirituality',
    id: 'Spirituality'
  }, {
    title: 'Sports',
    icon: 'fa-futbol-o',
    key: 'Sports',
    id: 'Sports'
  }, {
    title: 'Volunteer',
    icon: 'fa-handshake-o',
    key: 'Volunteer',
    id: 'Volunteer'
  }, {
    title: 'Others',
    icon: 'fa-snowflake-o',
    key: 'Others',
    id: 'Others'
  }];

  OwlCategoryOptions: OwlOptions = {
    loop: false,
    autoplay: false,
    autoplayTimeout: 6000,
    autoplaySpeed: 700,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    margin: 5,
    navSpeed: 700,
    navText: [ '<i class="fa-chevron-left"></i>', '<i class="fa-chevron-right></i>"' ],
    autoWidth: true,
    items: 8,
    nav: false,
    responsive: {
      0: {
        items: 3
      },
      740: {
        items: 8
      }
    },
  };


  isUserLoggedIn = false;
  commonSub: Subscription;

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
      this.owlInitialized();
    });

    this.categoryName = this.route.snapshot.params.categoryId;
    if (this.categoryName) {
      this.getCampainsByCategory(this.categoryName);
    } else {
      this.getCampainsByCategory('All');
    }
    this.commonSub = this.messageService.getCommonMessage().subscribe(message => {
      if (message.topic === 'categoryLoaded') {
        this.categories = this.common.categories;
      }
    });  }

  getCampainsByCategory(category) {
    this.isLoading = true;
    this.http.cancelCompaignByCategoryReq();
    this.campaignsList = [];
    this.http.getCompaignByCategory(category, this.page, this.pageSize, this.sorting.value, this.sorting.order).subscribe((result: any) => {
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

  applySorting(sorting) {
    sorting.order = sorting.order === 'Asc' ? 'Desc' : 'Asc';
    this.page = 1;
    this.sorting = sorting;
    this.getCampainsByCategory(this.categoryName);
  }

  gotoCategory(category) {
    this.router.navigate([`/category/${category.key}`]);
  }

  startCampaign() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/ce-fundraiser']);
    } else {
      this.messageService.sendCommonMessage({topic: 'showLogin', reason: 'CreateCampaign'});
    }
  }

  owlInitialized() {
    const actCategory = this.categoryList.filter(category => category.key === this.categoryName);
    this.owlCar.to((actCategory && actCategory.length) ? actCategory[0].id : '');
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

  ngOnDestroy() {
    this.commonSub.unsubscribe();
  }

}
