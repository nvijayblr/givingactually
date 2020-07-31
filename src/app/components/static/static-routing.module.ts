import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaticComponent } from './static.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ServicesComponent } from './services/services.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FaqComponent } from './faq/faq.component';
import { HighlightsComponent } from './highlights/highlights.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticRoutingModule { }
