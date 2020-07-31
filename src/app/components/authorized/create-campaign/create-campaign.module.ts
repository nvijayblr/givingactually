import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBnjQKvKIxr3UUoGCQ2EBSFvQrTEoz7gW8',
      libraries: ['places']
    })
  ]
})
export class CreateCampaignModule { }
