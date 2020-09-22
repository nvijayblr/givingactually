import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaticComponent } from './static.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ServicesComponent } from './services/services.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FaqComponent } from './faq/faq.component';
import { HighlightsComponent } from './highlights/highlights.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { TeamsComponent } from './teams/teams.component';
import { CareersComponent } from './careers/careers.component';
import { PricingComponent } from './pricing/pricing.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';

const routes: Routes = [
  {
    path: '',
    component: StaticComponent,
    children: [
      {
        path: '',
        redirectTo: 'about-us',
        pathMatch: 'full'
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
        path: 'teams',
        component: TeamsComponent
      }, {
        path: 'careers',
        component: CareersComponent
      }, {
        path: 'pricing',
        component: PricingComponent
      }, {
        path: 'privacy',
        component: PrivacyComponent
      }, {
        path: 'terms-conditions',
        component: TermsComponent
      }, {
        path: 'disclaimer',
        component: DisclaimerComponent
      }, {
        path: 'how-it-works',
        component: HowItWorksComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule { }
