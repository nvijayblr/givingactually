import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpServiceService } from '../../services/http-service.service';
import { MatPaginatorIntl } from '@angular/material';

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

  constructor(private route: ActivatedRoute, private http: HttpServiceService) { }

  ngOnInit() {
    this.categoryName = this.route.snapshot.params.categoryId;
    if (this.categoryName) {
      this.getCampainsByCategory(this.categoryName);
    } else {
      this.getCampainsByCategory('All');
    }
  }

  getCampainsByCategory(category) {
    this.isLoading = true;
    this.http.cancelCompaignByCategoryReg();
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
  }

  toLocaleString(value) {
    if (value) {
      return value.toLocaleString();
    }
    return '0';
  }

}
