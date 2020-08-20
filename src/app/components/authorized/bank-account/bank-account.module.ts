import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { BankAccountRoutingModule } from './bank-account-routing.module';
import { BankAccountComponent } from './bank-account.component';


@NgModule({
  declarations: [BankAccountComponent],
  imports: [
    CommonModule,
    SharedModule,
    BankAccountRoutingModule
  ]
})
export class BankAccountModule { }
