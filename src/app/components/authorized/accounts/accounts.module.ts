import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';


@NgModule({
  declarations: [AccountsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AccountsRoutingModule
  ]
})
export class AccountsModule { }
