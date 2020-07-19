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

  ngoList: any = {
    ngoSectors: [],
    ngoTypes: []
  };

  bankAccountDetailsForm: FormGroup;
  isbankAccountDetLoading = false;

  isUserLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpService,
    private router: Router,
    private authGuardService: AuthGuardService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
    this.user = this.authGuardService.getLoggedInUserDetails();
    this.userId = this.route.snapshot.params.userId;
    if (this.userId) {
      this.initPersonalDetails({});
      this.getUserCampaigns();
      this.initBankAccountDetails();
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
      DPName: [user.DisplayName, [Validators.required, Validators.maxLength(120)]],
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
    console.log(this.personalDetailsForm);
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
      UserId: 28
    };
    this.http.updateUserPersonalDetails(psersonalDetails).subscribe((result: any) => {
      this.isPersonalDetLoading = false;
      this.showPersonalSuccessMsg = true;
    }, (error) => {
      this.isPersonalDetLoading = false;
    });

  }

  initBankAccountDetails() {
    this.bankAccountDetailsForm = this.fb.group({
      AccountName: [''],
      AccountNumber: [''],
      BankName: [''],
      IFSCCode: [''],
      BranchAddress: [''],
    });
  }

  saveBankAccountDetails() {

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
          console.log(this.ngoList);
        }, err => {
          this.ngoList = {
            ngoSectors: [],
            ngoTypes: []
          };
        });
      }
    }
    // Load bank account details.
    if (tab.index === 2) {
      this.initBankAccountDetails();
    }
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
