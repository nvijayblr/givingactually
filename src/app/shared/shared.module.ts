import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from './modules/material.module';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginSignupComponent,
    ProgressBarComponent
  ],
  exports: [
    MaterialModule,
    HeaderComponent,
    FooterComponent,
    LoginSignupComponent,
    ProgressBarComponent
  ],
  providers: [DatePipe],
  entryComponents: [
    LoginSignupComponent
  ]
})
export class SharedModule {}
