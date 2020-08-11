import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { CreateCampaignRoutingModule } from './create-campaign-routing.module';
import { CreateCampaignComponent } from './create-campaign.component';


@NgModule({
  declarations: [CreateCampaignComponent],
  imports: [
    CommonModule,
    SharedModule,
    CreateCampaignRoutingModule,
    AngularEditorModule,
  ]
})
export class CreateCampaignModule { }
