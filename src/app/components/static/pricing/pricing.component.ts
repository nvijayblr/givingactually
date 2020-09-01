import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PricingComponent implements OnInit {

  pricing = {
    rasiseAmt: 100000,
    platformFee: 0,
    paymentGatewayFee: 2000,
    paymentGatewayPercent: 2,
    fundRaisePercent: 60,
    fundRaiseAmount: 60000,
    goalAmount: 102000,
    currency: 'INR'
  };

  constructor() { }

  ngOnInit() {
  }

  generateBreakup() {
    console.log(this.pricing);
    this.pricing.paymentGatewayFee = this.pricing.rasiseAmt * this.pricing.paymentGatewayPercent / 100;
    this.pricing.goalAmount = this.pricing.rasiseAmt + this.pricing.paymentGatewayFee;
  }

  toLocaleString(value) {
    if (value) {
      return value.toLocaleString();
    }
    return '0';
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

}
