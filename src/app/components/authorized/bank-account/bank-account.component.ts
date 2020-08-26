import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpService } from '../../../services/http-service.service';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { CommonService } from '../../../services/common.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { query } from '@angular/animations';
declare var Razorpay: any;

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})

export class BankAccountComponent implements OnInit, AfterViewInit {

  user: any = {};
  isLoading = false;
  isAccountLoading = false;
  loaderMessage = 'Saving...';
  errorMessage = '';
  campaign: any = {
    CampainOrganizer: {} as any,
    campaignDescription: {} as any,
  };
  campaignId = '';
  bankAccountForm: FormGroup;
  bankAccount: any = {};
  isBankAccountErr = false;

  isWithdrawal = false;
  withdrawalForm: FormGroup;
  remainDonationAmt = 0;
  isWithdrawalErr = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private authGuardService: AuthGuardService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) {
    }

  ngOnInit() {
    this.user = this.authGuardService.getLoggedInUserDetails();
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.w === 't') {
        this.isWithdrawal = true;
      }
      if (queryParams.id) {
        this.campaignId = queryParams.id;
        if (!this.campaign.Id) {
          if (!this.isWithdrawal) {
            this.getBankAccoountDetails(queryParams.id);
            this.initBankDetails();
          }
          if (this.isWithdrawal) {
            this.initWithdrawals();
          }
          this.getCampaignDetails(queryParams.id);
        }
      }
    });

    this.user = this.authGuardService.getLoggedInUserDetails();
  }

  ngAfterViewInit() {
  }

  initBankDetails() {
    this.isBankAccountErr = false;
    this.bankAccountForm = this.fb.group({
      CampaignId: [this.campaignId],
      BenName: [this.bankAccount.BenName, [Validators.required]],
      AccountNumber: [this.bankAccount.AccountNumber, [Validators.required, Validators.pattern('[0-9]{9,18}')]],
      IFSC: [this.bankAccount.IFSC, [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      BankName: [this.bankAccount.BankName, [Validators.required, Validators.minLength(3)]],
      BankBranch: [this.bankAccount.BankBranch, [Validators.required]]
    });
  }

  // IFSC Validation - SBIN0125620
  // It should be 11 characters long.
  // The first four characters should be upper case alphabets.
  // The fifth character should be 0.
  // The last six characters usually numeric, but can also be alphabetic.

  // Account Number
  // According to RBI Reserve Bank of India -> The bank should have 9-18 digits
  // https://www.rbi.org.in/scripts/PublicationReportDetails.aspx?ID=695#UAN

  initWithdrawals() {
    this.isBankAccountErr = false;
    this.withdrawalForm = this.fb.group({
      CampaignId: [this.campaignId],
      WithdrawalAmount: ['', [Validators.required]],
      WithDrawalReason: ['', [Validators.required]]
    });
  }

  saveBankAccountDetails() {
    this.isBankAccountErr = false;
    if (this.bankAccountForm.invalid) {
      this.isBankAccountErr = true;
      return;
    }
    this.isAccountLoading = true;
    this.loaderMessage = 'Resistering your bank account details...';
    this.http.createBankAccount(this.bankAccountForm.value).subscribe((result: any) => {
      this.isAccountLoading = false;
      this.router.navigate([`/accounts/${this.user.UserId}`]);
    }, (error) => {
      this.isAccountLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }


  // Get Campaign details
  getBankAccoountDetails(campaignId) {
    this.isAccountLoading = true;
    this.loaderMessage = 'Loding details...';
    this.http.getBankAccountDetails(campaignId).subscribe((result: any) => {
      this.bankAccount = result ? result : {};
      this.initBankDetails();
      this.isAccountLoading = false;
    }, (error) => {
      this.campaign = {};
      this.isAccountLoading = false;
      console.log(error.statusText);
    });
  }

  // Get Campaign details
  getCampaignDetails(campaignId) {
    this.isLoading = true;
    this.loaderMessage = 'Loding details...';
    this.http.cancelCompaignDetailsReq();
    this.http.getCompaignDetails(campaignId).subscribe((result: any) => {
      this.campaign = result ? result : {};
      this.isLoading = false;
      if (this.isWithdrawal) {
        this.withdrawalForm.controls.WithdrawalAmount.setValidators([Validators.min(1), Validators.max(this.campaign.RaisedAmount)]);
      }
    }, (error) => {
      this.campaign = {};
      this.isLoading = false;
      console.log(error.statusText);
    });
  }

  submitWithdraw() {
    this.isWithdrawalErr = false;
    if (this.withdrawalForm.invalid) {
      this.isWithdrawalErr = true;
      return;
    }
    this.isLoading = true;
    this.loaderMessage = 'Resistering your withdraw details...';
    this.http.createWithdraw(this.withdrawalForm.value).subscribe((result: any) => {
      this.isLoading = false;
      this.showCompletionMsg();
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  showCompletionMsg() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Withdrawal request successful',
        // tslint:disable-next-line: max-line-length
        message: 'Your withdrawal request has been sent to the Admin. You will receive notification email when the amount is transferred to your account.',
        cancelLable: '',
        okLable: 'OK'
      }
    });

    dialogRef.afterClosed().subscribe(action => {
      if (action === 'ok') {
        this.router.navigate([`/accounts/${this.user.UserId}`]);
      }
    });
  }


  gotoAccounts() {
    this.router.navigate([`/accounts/${this.user.UserId}`]);
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
