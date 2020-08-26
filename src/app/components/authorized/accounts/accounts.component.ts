import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from '../../../services/http-service.service';
import { ShareService } from 'ngx-sharebuttons';
import { forkJoin, Subscriber } from 'rxjs';
import * as moment from 'moment';
import { MatPaginatorIntl } from '@angular/material';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { MessageService } from '../../../services/message.service';

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

  user: any = {};
  userId: any = '';
  campaignsList: any = [];
  pageEvent: any = {};
  total = 0;
  page = 1;
  pageSize = 3;

  personalDetailsForm: FormGroup;
  isPersonalDetLoading = false;
  showPersonalSuccessMsg = false;
  showPersonalErrorMsg = false;
  loaderMessage = '';
  isStatLoading = false;
  statistics = {};
  donationsList = [];

  ngoList: any = {
    ngoSectors: [],
    ngoTypes: []
  };

  isUserLoggedIn = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authGuardService: AuthGuardService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
    this.user = this.authGuardService.getLoggedInUserDetails();
    this.activatedRoute.params.subscribe(routeParams => {
      this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
      this.user = this.authGuardService.getLoggedInUserDetails();
      this.userId = this.route.snapshot.params.userId;
      if (this.userId === this.user.UserId) {
        this.initPersonalDetails({});
        this.getUserCampaigns();
        this.getUsersStatistics();
        this.isEditMode = true;
      } else {
        // Show dashboard for other users
        this.initPersonalDetails({});
        this.isEditMode = false;
        this.user = {};
        this.getUsersDetails();
        this.getUsersStatistics();
        this.getUserCampaigns();
      }
    });

  }

  getUsersDetails() {
    this.http.getUserDetails(this.userId).subscribe((result: any) => {
      this.isPersonalDetLoading = false;
      this.user = result;
    }, (error) => {
      this.isPersonalDetLoading = false;
    });
  }

  getUsersStatistics() {
    this.isStatLoading = true;
    this.http.getUserStatistics(this.userId).subscribe((result: any) => {
      this.statistics = result;
      this.isStatLoading = false;
    }, (error) => {
      this.isStatLoading = false;
    });
  }

  getUsersDonations() {
    this.isStatLoading = true;
    this.donationsList = [];
    this.http.getUserDonations().subscribe((result: any) => {
      this.donationsList = result.MyDonationList;
      console.log(this.donationsList);
      this.isStatLoading = false;
    }, (error) => {
      this.isStatLoading = false;
    });
  }

  getUserCampaigns() {
    this.isLoading = true;
    this.http.cancelCompaignsListReq();
    this.http.getUserCampaigns(this.userId, this.page, this.pageSize).subscribe((result: any) => {
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

  getUserPersonalDetails() {
    this.isPersonalDetLoading = true;
    this.showPersonalSuccessMsg = false;
    this.showPersonalErrorMsg = false;
    this.loaderMessage = 'Loading Personal Details...';
    this.http.getUserDetails(this.userId).subscribe((result: any) => {
      this.isPersonalDetLoading = false;
      this.initPersonalDetails(result);
    }, (error) => {
      this.isPersonalDetLoading = false;
    });
  }

  initPersonalDetails(user) {
    this.personalDetailsForm = this.fb.group({
      UserName: [{value: user.UserName, disabled: true}],
      FirstName: [user.FirstName, [Validators.required, Validators.maxLength(120)]],
      LastName: [user.LastName, [Validators.required, Validators.maxLength(120)]],
      IsNGO: [user.IsNGO],
      CanEndorse: [user.CanEndorse],
      NGOSector: [user.NGOSectorName],
      NGOType: [user.NGOTypeName],
      RegisterationNo: [user.RegisterationNo],
      Registeredat: [user.Registeredat],
      cityName: [user.cityName],
      stateName: [user.stateName],
      countryName: [user.countryName],
    });
    this.setNGOValidators();
  }

  setNGOValidators() {
    const IsNGO = this.personalDetailsForm.controls.IsNGO.value;
    if (IsNGO) {
      this.personalDetailsForm.controls.RegisterationNo.setValidators([Validators.required]);
      this.personalDetailsForm.controls.Registeredat.setValidators([Validators.required]);
      this.personalDetailsForm.controls.cityName.setValidators([Validators.required]);
      this.personalDetailsForm.controls.stateName.setValidators([Validators.required]);
      this.personalDetailsForm.controls.countryName.setValidators([Validators.required]);
    } else {
      this.personalDetailsForm.controls.RegisterationNo.setValidators(null);
      this.personalDetailsForm.controls.Registeredat.setValidators(null);
      this.personalDetailsForm.controls.cityName.setValidators(null);
      this.personalDetailsForm.controls.stateName.setValidators(null);
      this.personalDetailsForm.controls.countryName.setValidators(null);

      this.personalDetailsForm.controls.RegisterationNo.setValue(null);
      this.personalDetailsForm.controls.Registeredat.setValue(null);
      this.personalDetailsForm.controls.cityName.setValue(null);
      this.personalDetailsForm.controls.stateName.setValue(null);
      this.personalDetailsForm.controls.countryName.setValue(null);
    }
    this.setCanEndorseValidators();
    // this.personalDetailsForm.markAllAsTouched();
  }

  setCanEndorseValidators() {
    const CanEndorse = this.personalDetailsForm.controls.CanEndorse.value;
    if (CanEndorse) {
      this.personalDetailsForm.controls.NGOSector.setValidators([Validators.required]);
      this.personalDetailsForm.controls.NGOType.setValidators([Validators.required]);
    } else {
      this.personalDetailsForm.controls.NGOSector.setValidators(null);
      this.personalDetailsForm.controls.NGOType.setValidators(null);

      this.personalDetailsForm.controls.NGOSector.setValue(null);
      this.personalDetailsForm.controls.NGOType.setValue(null);
    }
    this.showPersonalErrorMsg = false;
    this.showPersonalSuccessMsg = false;
    // this.personalDetailsForm.markAllAsTouched();
  }

  savePersonalDetails() {
    if (!this.personalDetailsForm.valid) {
      this.showPersonalErrorMsg = true;
      this.showPersonalSuccessMsg = false;
      return;
    }
    this.showPersonalErrorMsg = false;
    this.showPersonalSuccessMsg = false;
    this.loaderMessage = 'Saving...';
    this.isPersonalDetLoading = true;
    const psersonalDetails = {
      ...this.personalDetailsForm.value,
      UserId: this.userId
    };
    this.http.updateUserPersonalDetails(psersonalDetails).subscribe((result: any) => {
      this.isPersonalDetLoading = false;
      this.showPersonalSuccessMsg = true;
    }, (error) => {
      this.isPersonalDetLoading = false;
    });

  }

  showWithdrawHistory(campaign) {
    campaign.isShowWithdrawHistory = true;
    campaign.isWithdrawLoading = true;
    this.http.getWithdrawHistory(campaign.Id).subscribe((result: any) => {
      campaign.isWithdrawLoading = false;
      console.log(result);
      campaign.withdrawList = result.WithDrawalList ? result.WithDrawalList : [];
    }, (error) => {
      campaign.isWithdrawLoading = false;
      campaign.withdrawList = [];
    });
  }

  hideWithdrawHistory(campaign) {
    campaign.isShowWithdrawHistory = false;
  }

  tabChange(tab) {
    // Personal Deitails Tab
    if (tab.index === 1) {
      this.getUserPersonalDetails();
      if (this.ngoList.ngoSectors.length === 0) {
        forkJoin([this.http.getNGOSectors(), this.http.getNGOTypes()]).subscribe(responses => {
          this.ngoList = {
            ngoSectors: responses[0],
            ngoTypes: responses[1]
          };
        }, err => {
          this.ngoList = {
            ngoSectors: [],
            ngoTypes: []
          };
        });
      }
    }
    if (tab.index === 2) {
      this.getUsersDonations();
    }
  }

  startCampaign() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/ce-fundraiser']);
    } else {
      this.messageService.sendCommonMessage({topic: 'showLogin', reason: 'CreateCampaign'});
    }
  }

  convertToK(input) {
    let exp;
    const rounded = 2;
    const suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];

    if (Number.isNaN(input)) {
      return 0;
    }
    if (input < 1000) {
      return input;
    }
    exp = Math.floor(Math.log(input) / Math.log(1000));
    return (input / Math.pow(1000, exp)).toFixed(rounded) + suffixes[exp - 1];
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
