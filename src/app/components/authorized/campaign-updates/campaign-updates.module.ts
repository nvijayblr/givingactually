import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { CampaignUpdatesRoutingModule } from './campaign-updates-routing.module';
import { CampaignUpdatesComponent } from './campaign-updates.component';


@NgModule({
  declarations: [CampaignUpdatesComponent],
  imports: [
    CommonModule,
    SharedModule,
    AngularEditorModule,
    CampaignUpdatesRoutingModule
  ]
})
export class CampaignUpdatesModule { }
