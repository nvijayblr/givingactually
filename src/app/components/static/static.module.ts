import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { StaticRoutingModule } from './static-routing.module';
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


@NgModule({
  declarations: [
    StaticComponent,
    AboutusComponent,
    ServicesComponent,
    ContactusComponent,
    FaqComponent,
    HighlightsComponent,
    PrivacyComponent,
    TermsComponent,
    DisclaimerComponent,
    CareersComponent,
    PricingComponent,
    TeamsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    StaticRoutingModule
  ]
})
export class StaticModule { }
