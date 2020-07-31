import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ShareModule } from 'ngx-sharebuttons';

import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CampaignsComponent } from './campaigns.component';


@NgModule({
  declarations: [CampaignsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ShareModule.withConfig({
      debug: false
    }),
    CampaignsRoutingModule
  ]
})
export class CampaignsModule { }
