import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignUpdatesComponent } from './campaign-updates.component';

const routes: Routes = [{ path: '', component: CampaignUpdatesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignUpdatesRoutingModule { }
