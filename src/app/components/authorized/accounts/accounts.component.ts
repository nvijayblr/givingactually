import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from '../../../services/http-service.service';
import { ShareService } from 'ngx-sharebuttons';
import { Subscriber } from 'rxjs';
import * as moment from 'moment';
import { MatPaginatorIntl } from '@angular/material';

const customPaginatorIntl = new MatPaginatorIntl();
customPaginatorIntl.itemsPerPageLabel = 'Campaigns per page:';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ShareService]

})
export class AccountsComponent implements OnInit {


  isLoading = true;

  userId: any = '';
  campaignsList: any = [];
  pageEvent: any = {};
  total = 0;
  page = 1;
  pageSize = 3;

  constructor(private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit() {
    this.userId = this.route.snapshot.params.userId;
    console.log(this.userId);
    if (this.userId) {
      this.getUserCampaigns();
    }
  }

  getUserCampaigns() {
    this.isLoading = true;
    this.http.cancelCompaignsListReq();
    this.http.getUserCampaigns(this.page, this.pageSize).subscribe((result: any) => {
      this.campaignsList = result.CampaignLists ? result.CampaignLists : [];
      this.total = result.TotalCampaigns;
      this.isLoading = false;
    }, (error) => {
      this.campaignsList = [];
      this.isLoading = false;
    });
  }

  onPaginationChange(event) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getUserCampaigns();
    window.scrollTo(0, 0);
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

  formatDate(date) {
    if (date) {
      return moment(date).format('DD, MMM YYYY');
    }
    return '';
  }
}
