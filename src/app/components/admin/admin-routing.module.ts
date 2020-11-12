import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CampaignsListComponent } from './components/campaigns-list/campaigns-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { BankAccountsListComponent } from './components/bank-accounts-list/bank-accounts-list.component';
import { WithdrawalsListComponent } from './components/withdrawals-list/withdrawals-list.component';

const routes: Routes = [
  { path: '', component: AdminComponent,
  children: [
    {path: '', redirectTo: 'fundraisers', pathMatch: 'full'},
    { path: 'fundraisers', component: CampaignsListComponent },
    { path: 'users', component: UsersListComponent },
    { path: 'bank-accounts', component: BankAccountsListComponent },
    { path: 'withdrawals', component: WithdrawalsListComponent },
  ]
}];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }


