import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from '../../services/http-service.service';
import { ShareService } from 'ngx-sharebuttons';
import { Subscriber } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ShareService]
})
export class CampaignsComponent implements OnInit {
  OwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: true
  };

  OwlCommentsOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: false,
    navSpeed: 700,
    autoHeight: true,
    navText: ['', ''],
    items: 1,
  };


  isLoading = true;
  isReadMore = false;

  campaignId: any = '';
  campaign: any = {
    campaignDescription: {},
    CampainOrganizer: {},
    CampaignDonationList: [],
    EndorsementsList: {},
    // Comments: [{
    //   Users: {}
    // }]
  };
  curComment = 1;

  constructor(private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit() {
    this.campaignId = this.route.snapshot.params.campaignId;
    if (this.campaignId) {
      this.getCampaignDetails(this.campaignId);
    }
  }

  getCampaignDetails(campaignId) {
    this.isLoading = true;
    this.http.cancelCompaignDetailsReq();
    this.http.getCompaignDetails(campaignId).subscribe((result: any) => {
      this.campaign = result ? result : {};
      this.isLoading = false;
      console.log(this.campaign);
    }, (error) => {
      this.campaign = {};
      this.isLoading = false;
      console.log(error.statusText);
    });
  }

  onCommentsChanges(event) {
    this.curComment = (event.startPosition + 1);
    console.log('eventeventevent...', event);
  }

  onReadMore() {
    this.isReadMore = !this.isReadMore;
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
