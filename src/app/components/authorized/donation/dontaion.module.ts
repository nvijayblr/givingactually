import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { DonationRoutingModule } from './donation-routing.module';
import { DonationComponent } from './donation.component';


@NgModule({
  declarations: [DonationComponent],
  imports: [
    CommonModule,
    SharedModule,
    DonationRoutingModule
  ]
})
export class DonationModule { }
