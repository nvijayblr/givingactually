import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuardService as AuthGaurd } from './services/auth-guard.service';

import { HomeComponent } from './components/home/home.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { FaqComponent } from './components/faq/faq.component';
import { HighlightsComponent } from './components/highlights/highlights.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { CategoryComponent } from './components/category/category.component';

// Authorized components
import { AccountsComponent } from './components/authorized/accounts/accounts.component';
import { CreateCampaignComponent } from './components/authorized/create-campaign/create-campaign.component';
import { CampaignUpdatesComponent } from './components/authorized/campaign-updates/campaign-updates.component';
import { DonationComponent } from './components/authorized/donation/donation.component';

const routes: Routes = [{
    path: 'home',
    component: HomeComponent
  }, {
    path: 'campaigns/:campaignId',
    component: CampaignsComponent
  }, {
    path: 'category/:categoryId',
    component: CategoryComponent
  }, {
    path: 'accounts/:userId',
    component: AccountsComponent,
    canActivate: [AuthGaurd]
  }, {
    path: 'ce-campaign',
    component: CreateCampaignComponent,
    // canActivate: [AuthGaurd]
  }, {
    path: 'campaign-updates',
    component: CampaignUpdatesComponent,
    canActivate: [AuthGaurd]
  }, {
    path: 'donation',
    component: DonationComponent,
  }, {
    path: 'about-us',
    component: AboutusComponent
  }, {
    path: 'services',
    component: ServicesComponent
  }, {
    path: 'contact-us',
    component: ContactusComponent
  }, {
    path: 'faq',
    component: FaqComponent
  }, {
    path: 'highlights',
    component: HighlightsComponent
  }, {
    path: '', redirectTo: '/home', pathMatch: 'full'
  }, {
    path: '**', redirectTo: '/home', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
