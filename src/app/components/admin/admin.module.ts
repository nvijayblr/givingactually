import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CampaignsListComponent } from './components/campaigns-list/campaigns-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { BankAccountsListComponent } from './components/bank-accounts-list/bank-accounts-list.component';
import { WithdrawalsListComponent } from './components/withdrawals-list/withdrawals-list.component';


@NgModule({
  declarations: [AdminComponent, CampaignsListComponent, UsersListComponent, BankAccountsListComponent, WithdrawalsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
