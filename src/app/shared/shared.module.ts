import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ImageCropperModule,
    AngularEditorModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginSignupComponent,
    ProgressBarComponent,
    ImageCropperComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ImageCropperModule,
    AngularEditorModule,
    HeaderComponent,
    FooterComponent,
    LoginSignupComponent,
    ProgressBarComponent,
    ImageCropperComponent
  ],
  providers: [DatePipe],
  entryComponents: [
    LoginSignupComponent
  ]
})
export class SharedModule {}
