import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpService } from '../../../services/http-service.service';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})

export class DonationComponent implements OnInit, AfterViewInit {

  user: any = {};
  isLoading = false;
  loaderMessage = 'Saving...';
  errorMessage = '';
  campaign: any = {
    CampainOrganizer: {} as any,
    campaignDescription: {} as any,
  };
  campaignId = '';
  donationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private authGuardService: AuthGuardService,
    private route: ActivatedRoute,
    private router: Router, ) {
    }

  ngOnInit() {
    this.user = this.authGuardService.getLoggedInUserDetails();
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.id) {
        this.campaignId = queryParams.id;
        if (!this.campaign.Id) {
          this.getCampaignDetails(queryParams.id);
        }
      }
    });

    this.user = this.authGuardService.getLoggedInUserDetails();
    this.initDonationDetails(this.user);
  }

  ngAfterViewInit() {
  }

  initDonationDetails(user) {
    this.donationForm = this.fb.group({
      CampaignId: [this.campaignId],
      DonationMoneyType: ['INR', [Validators.required, Validators.min(1)]],
      DonationAmnt: ['', [Validators.required]],
      DonorName: [user.DisplayName, [Validators.required]],
      isAnanymous: [''],
      EMail: [user.userName, [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.required]],
      PlaceName: ['', [Validators.required]],
    });
  }

  setAnanymous() {

  }

  donateClick() {
    console.log(this.donationForm.value);
  }

  // Get Campaign details
  getCampaignDetails(campaignId) {
    this.isLoading = true;
    this.loaderMessage = 'Loding details...';
    this.http.cancelCompaignDetailsReq();
    this.http.getCompaignDetails(campaignId).subscribe((result: any) => {
      this.campaign = result ? result : {};
      this.isLoading = false;
    }, (error) => {
      this.campaign = {};
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
