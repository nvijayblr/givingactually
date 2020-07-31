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


@NgModule({
  declarations: [
    StaticComponent,
    AboutusComponent,
    ServicesComponent,
    ContactusComponent,
    FaqComponent,
    HighlightsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    StaticRoutingModule
  ]
})
export class StaticModule { }
