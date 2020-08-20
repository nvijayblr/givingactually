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
declare var Razorpay: any;

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
  razorPayments: any = {};
  isDonationErr = false;
  remainDonationAmt = 0;

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
    this.isDonationErr = false;
    this.donationForm = this.fb.group({
      CampaignId: [this.campaignId],
      DonationMoneyType: ['INR', [Validators.required]],
      DonationAmnt: ['', [, Validators.min(50), Validators.required]],
      DonorName: [user.DisplayName, [Validators.required]],
      isAnanymous: [''],
      EMail: [user.userName, [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.required]],
      PlaceName: ['', [Validators.required]],
    });
  }

  donateClick() {
    this.isDonationErr = false;
    if (this.donationForm.invalid) {
      this.isDonationErr = true;
      return;
    }
    this.isLoading = true;
    this.loaderMessage = 'Resistering your dontation...';
    this.http.registerDonation(this.donationForm.value).subscribe((result: any) => {
      this.razorPayments = result;
      this.isLoading = false;
      this.makeRazerpayPayment(this.razorPayments);
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  makeRazerpayPayment(payment) {
    const aThis = this;
    const options = {
      key: payment.RazorPayKey,
      amount: payment.Amount * 100,
      name: 'MARKET',
      description: payment.orderId,
      handler(response) {
        const paymentObj = {
          razorpay_order_id: payment.orderId,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: payment.RazorPayKey
        };
        aThis.confirmPaymentSuccess(paymentObj);
      },
      prefill: {
          name:  this.donationForm.controls.DonorName.value,
          email: payment.Email,
          contact: payment.PhNo,
      },
      notes: {},
      theme: {
        color: '#008b6e'
      }
    };
    const razorpay = new Razorpay(options);
    razorpay.open();
  }

  confirmPaymentSuccess(paymentObj) {
    this.isLoading = true;
    this.loaderMessage = 'Confirming your dontation...';
    this.http.confirmPaymentSuccess(paymentObj).subscribe((result: any) => {
      this.isLoading = false;
      this.showSuccessPayment();
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  showSuccessPayment() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Donation',
        message: 'Thank you. We have received your donation.',
        cancelLable: 'Go to Home',
        okLable: 'Go to this Campaign'
      }
    });

    dialogRef.afterClosed().subscribe(action => {
      if (action === 'ok') {
        this.router.navigate([`/fundraiser/${this.campaignId}`]);
      } else {
        this.router.navigate([`/home`]);
      }
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
      this.remainDonationAmt = this.campaign.CampaignTargetMoney - this.campaign.RaisedAmount;
      this.donationForm.controls.DonationAmnt.setValidators([Validators.min(50), Validators.max(this.remainDonationAmt)]);
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

  getFirstLetter(name) {
    if (name) {
      return name.substr(0, 1);
    }
    return '';
  }


}
