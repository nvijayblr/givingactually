import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuardService as AuthGaurd } from './services/auth-guard.service';

const routes: Routes = [{
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
  }, {
    path: 'fundraiser/:campaignId',
    loadChildren: () => import('./components/campaigns/campaigns.module').then(m => m.CampaignsModule),
  }, {
    path: 'category/:categoryId',
    loadChildren: () => import('./components/category/category.module').then(m => m.CategoryModule),
  }, {
    path: 'search',
    loadChildren: () => import('./components/search/search.module').then(m => m.SearchModule),
  }, {
    path: 'accounts/:userId',
    loadChildren: () => import('./components/authorized/accounts/accounts.module').then(m => m.AccountsModule),
    canActivate: [AuthGaurd]
  }, {
    path: 'bank-account',
    loadChildren: () => import('./components/authorized/bank-account/bank-account.module').then(m => m.BankAccountModule),
    canActivate: [AuthGaurd]
  }, {
    path: 'amount-withdrawal',
    loadChildren: () => import('./components/authorized/bank-account/bank-account.module').then(m => m.BankAccountModule),
    canActivate: [AuthGaurd]
  }, {
    path: 'ce-campaign',
    loadChildren: () => import('./components/authorized/create-campaign/create-campaign.module').then(m => m.CreateCampaignModule),
    canActivate: [AuthGaurd]
  }, {
    path: 'campaign-updates',
    loadChildren: () => import('./components/authorized/campaign-updates/campaign-updates.module').then(m => m.CampaignUpdatesModule),
    canActivate: [AuthGaurd]
  }, {
    path: 'donation',
    loadChildren: () => import('./components/authorized/donation/dontaion.module').then(m => m.DonationModule),
  }, {
    path: 'ga',
    loadChildren: () => import('./components/static/static.module').then(m => m.StaticModule)
  }, {
    path: '', redirectTo: '/home', pathMatch: 'full'
  }, {
    path: '**', redirectTo: '/home', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
