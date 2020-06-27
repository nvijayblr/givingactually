import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from '../../services/http-service.service';

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
    nav: false
  };

  isLoading = true;
  campaignsList: any = [];

  constructor(
    private http: HttpService
  ) { }

  ngOnInit() {
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

  toLocaleString(value) {
    if (value) {
      return value.toLocaleString();
    }
    return '0';
  }

}
